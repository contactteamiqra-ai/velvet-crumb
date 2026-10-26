"""Blender 4.3+ asset preparation. Run after downloading the licensed source.
blender -b -t 3 --python scripts/assets/prepare-cake.py -- SOURCE.gltf OUTPUT.glb
Preserves source UVs/materials; creates a reversible slice from the scan itself.
"""
import bpy, bmesh, math, sys, json
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
source=Path(args[0]).resolve(); output=Path(args[1]).resolve()
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
# Bake import transforms before normalizing. glTF +Y up is converted to Blender +Z up.
for o in meshes:
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
low=Vector([min((o.matrix_world@v.co)[i] for o in meshes for v in o.data.vertices) for i in range(3)])
high=Vector([max((o.matrix_world@v.co)[i] for o in meshes for v in o.data.vertices) for i in range(3)])
center=(low+high)/2;factor=3.3/max(high.x-low.x,high.y-low.y)
for o in meshes:
    for v in o.data.vertices:
        p=o.matrix_world@v.co
        v.co=Vector(((p.x-center.x)*factor,(p.y-center.y)*factor,(p.z-low.z)*factor))
    o.matrix_world.identity()
# Close the scan's open underside before radial bisection. Otherwise radial
# boundaries are open chains and cannot form watertight interior faces.
for o in meshes:
    bm=bmesh.new();bm.from_mesh(o.data)
    bmesh.ops.holes_fill(bm,edges=[e for e in bm.edges if e.is_boundary],sides=0)
    bm.to_mesh(o.data);bm.free()
# Input atlas remains unchanged. The newly exposed cut has its own material/UVs.
mat=bpy.data.materials.new('Authored cut interior • sponge and chocolate cream');mat.use_nodes=True
nodes=mat.node_tree.nodes;links=mat.node_tree.links;bsdf=nodes.get('Principled BSDF')
base=Path(__file__).resolve().parents[2]/'assets/source/cake'
for name,socket,noncolor in [('interior-color.jpg','Base Color',False),('interior-roughness.jpg','Roughness',True)]:
    t=nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(base/name))
    if noncolor:t.image.colorspace_settings.name='Non-Color'
    links.new(t.outputs['Color'],bsdf.inputs[socket])
normal=nodes.new('ShaderNodeTexImage');normal.image=bpy.data.images.load(str(base/'interior-normal.jpg'));normal.image.colorspace_settings.name='Non-Color'
n=nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.75;links.new(normal.outputs['Color'],n.inputs['Color']);links.new(n.outputs['Normal'],bsdf.inputs['Normal'])
bsdf.inputs['IOR'].default_value=1.45
start=math.radians(-82);width=math.radians(36);end=start+width
planes=[Vector((-math.sin(a),math.cos(a),0)) for a in (start,end)]
# Keep the intact scan for the hero; no artificial seam is visible before the cut.
whole=bpy.data.objects.new('CakeWhole',None);bpy.context.collection.objects.link(whole)
for original in meshes: original.parent=whole
# Clip convex sectors and close each radial plane separately. Filling the two-plane
# V-shaped boundary in one operation produces a non-planar cap across the interior.
def sector(original, name, first, second):
    obj=original.copy();obj.data=original.data.copy();bpy.context.collection.objects.link(obj)
    obj.parent=roots[name];obj.name=name+'_surface';obj.data.materials.append(mat);idx=len(obj.data.materials)-1
    bm=bmesh.new();bm.from_mesh(obj.data)
    for angle,keep_positive in [(first,True),(second,False)]:
        normal=Vector((-math.sin(angle),math.cos(angle),0))
        result=bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-6,plane_co=(0,0,0),plane_no=normal,clear_inner=keep_positive,clear_outer=not keep_positive)
        boundary=[e for e in bm.edges if e.is_boundary and all(abs(v.co.dot(normal))<2e-5 for v in e.verts)]
        caps=bmesh.ops.holes_fill(bm,edges=boundary,sides=0).get('faces',[])
        uv=bm.loops.layers.uv.verify()
        for face in caps:
            face.material_index=idx
            for loop in face.loops:
                v=loop.vert.co
                loop[uv].uv=(math.hypot(v.x,v.y)/3.3+.05,v.z/cake_height)
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free()
    # This scan has many disconnected atlas islands. Its radial edge chains do
    # not all close, so build a sampled radial interior behind the scanned edge.
    # The cut interior is authored, not part of the photographic scan.
    for angle in (first,second):
        direction=Vector((math.cos(angle),math.sin(angle),0))
        normal=Vector((-math.sin(angle),math.cos(angle),0))
        points=[(v.co.dot(direction),v.co.z) for v in obj.data.vertices if abs(v.co.dot(normal))<2e-5 and v.co.dot(direction)>-.001]
        bins={}
        for radius,z in points:
            key=round(radius/.025)
            bins[key]=max(bins.get(key,0),z)
        profile=sorted((k*.025,z) for k,z in bins.items() if z>.08)
        if len(profile)<2:continue
        profile[0]=(0,profile[0][1])
        verts=[]
        for radius,z in profile:
            verts.extend([tuple(direction*radius),tuple(direction*radius+Vector((0,0,z)))])
        faces=[(2*i,2*i+2,2*i+3,2*i+1) for i in range(len(profile)-1)]
        mesh=bpy.data.meshes.new(name+'_radial_interior');mesh.from_pydata(verts,[],faces);mesh.materials.append(mat)
        uv=mesh.uv_layers.new()
        for poly in mesh.polygons:
            for li in poly.loop_indices:
                v=mesh.vertices[mesh.loops[li].vertex_index].co
                uv.data[li].uv=(v.dot(direction)/3.3+.05,v.z/cake_height)
        cap=bpy.data.objects.new(name+'_authored_cut',mesh);bpy.context.collection.objects.link(cap);cap.parent=roots[name]
    if not len(obj.data.polygons):bpy.data.objects.remove(obj,do_unlink=True)
cake_height=(high.z-low.z)*factor
roots={}
for name in ('CakeBody','CakeSlice'):
    root=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(root);roots[name]=root
for original in meshes:
    sector(original,'CakeSlice',start,end)
    sector(original,'CakeBody',end,start+math.pi)
    sector(original,'CakeBody',start+math.pi,start+2*math.pi)
# A quiet porcelain board gives the lower scan edge a grounded contact surface.
bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=1.78,depth=.055,location=(0,0,-.0275))
board=bpy.context.object;board.name='CakeBoard'
porcelain=bpy.data.materials.new('Warm porcelain');porcelain.diffuse_color=(.24,.20,.16,1);porcelain.use_nodes=True
porcelain.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.3
board.data.materials.append(porcelain)
bevel=board.modifiers.new('Soft porcelain rim','BEVEL');bevel.width=.025;bevel.segments=3
for poly in board.data.polygons:poly.use_smooth=True
# Source remains an editable Blender asset; embedded maps travel with the GLB.
output.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).resolve().parents[2]/'work/assets/cake-source.blend'))
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',export_yup=True,export_image_format='AUTO',export_materials='EXPORT',export_normals=True)
print('ASSET_READY',str(output))

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
roots={}
for name in ('CakeBody','CakeSlice'):
    root=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(root);roots[name]=root
    for original in meshes:
        obj=original.copy();obj.data=original.data.copy();bpy.context.collection.objects.link(obj)
        obj.parent=root;obj.name=name+'_surface';obj.data.materials.append(mat);idx=len(obj.data.materials)-1
        bm=bmesh.new();bm.from_mesh(obj.data)
        for normal in planes:
            bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-6,plane_co=(0,0,0),plane_no=normal,clear_inner=False,clear_outer=False)
        remove=[]
        for face in bm.faces:
            c=face.calc_center_median();angle=math.atan2(c.y,c.x)
            inside=start-1e-6<=angle<=end+1e-6
            if inside != (name=='CakeSlice'):remove.append(face)
        bmesh.ops.delete(bm,geom=remove,context='FACES')
        boundary=[e for e in bm.edges if e.is_boundary]
        caps=bmesh.ops.holes_fill(bm,edges=boundary,sides=0).get('faces',[])
        uv=bm.loops.layers.uv.verify()
        for face in caps:
            face.material_index=idx
            for loop in face.loops:
                v=loop.vert.co
                # Planar, metric UV on cut faces. All parts sample identical layer elevations.
                loop[uv].uv=(math.hypot(v.x,v.y)/3.3+.05,v.z/1.85)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free()
        if len(obj.data.polygons)==0:bpy.data.objects.remove(obj,do_unlink=True)
for o in meshes:bpy.data.objects.remove(o,do_unlink=True)
# Source remains an editable Blender asset; embedded maps travel with the GLB.
output.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).resolve().parents[2]/'work/assets/cake-source.blend'))
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',export_yup=True,export_image_format='AUTO',export_materials='EXPORT',export_normals=True)
print('ASSET_READY',str(output))

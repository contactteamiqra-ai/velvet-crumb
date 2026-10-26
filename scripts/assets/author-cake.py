"""Original Blender look-development cake, not a substitute claimed as a scan.
Run: blender -b -t 3 --python scripts/assets/author-cake.py
Output: editable work/assets/atelier-cake.blend, local GLB for visual review.
"""
import bpy,math,random
from mathutils import Vector,noise
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public/assets/cake';MAPS=ROOT/'assets/source/cake';random.seed(142)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def material(name,color,roughness,coat=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=roughness;p.inputs['Coat Weight'].default_value=coat;p.inputs['Coat Roughness'].default_value=.18;p.inputs['IOR'].default_value=1.46
    return m
crumb=material('Moist dark chocolate crumb • original PBR',(.5,.5,.5),.9)
p=crumb.node_tree.nodes.get('Principled BSDF')
for file,socket in [('crumb-color.jpg','Base Color'),('crumb-roughness.jpg','Roughness')]:
    t=crumb.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(MAPS/file));
    if socket=='Roughness':t.image.colorspace_settings.name='Non-Color'
    crumb.node_tree.links.new(t.outputs['Color'],p.inputs[socket])
t=crumb.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(MAPS/'crumb-normal.jpg'));t.image.colorspace_settings.name='Non-Color';n=crumb.node_tree.nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.8;crumb.node_tree.links.new(t.outputs['Color'],n.inputs['Color']);crumb.node_tree.links.new(n.outputs['Normal'],p.inputs['Normal'])
cream=material('Whipped dark chocolate cream',(.13,.065,.035),.39,.12)
ganache=material('Belgian ganache • satin clearcoat',(.047,.018,.010),.25,.42)
shaving=material('Tempered chocolate ribbons',(.065,.026,.014),.32,.26)
def emulsion_maps(mat,prefix):
    nodes=mat.node_tree.nodes;links=mat.node_tree.links;p=nodes.get('Principled BSDF')
    for suffix in ['roughness','normal']:
        t=nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(MAPS/(prefix+'-'+suffix+'.jpg')));t.image.colorspace_settings.name='Non-Color'
        if suffix=='roughness':links.new(t.outputs['Color'],p.inputs['Roughness'])
        else:
            n=nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.5;links.new(t.outputs['Color'],n.inputs['Color']);links.new(n.outputs['Normal'],p.inputs['Normal'])
emulsion_maps(cream,'cream');emulsion_maps(ganache,'ganache');emulsion_maps(shaving,'ganache')
gold=material('Edible gold leaf',(.68,.39,.12),.32);gold.node_tree.nodes.get('Principled BSDF').inputs['Metallic'].default_value=.92
board=material('Brushed champagne cake board',(.32,.19,.09),.34);board.node_tree.nodes.get('Principled BSDF').inputs['Metallic'].default_value=.82
roots={}
for name in ('CakeBody','CakeSlice','CakeWhole'):
    root=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(root);roots[name]=root
start=math.radians(-82);length=math.radians(36)
def perturb(x,y,z,amount=.01):return noise.noise_vector(Vector((x*17+2,y*17,z*13)))[0]*amount

def make_mesh(name,verts,faces,mat,parent,uvs=None,smooth=True):
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(mat);obj.parent=parent
    uv=mesh.uv_layers.new(name='UVMap')
    for poly in mesh.polygons:
        poly.use_smooth=smooth
        for li in poly.loop_indices:
            index=mesh.loops[li].vertex_index;v=verts[index]
            uv.data[li].uv=uvs[index] if uvs else (v[0]*.8+.5,v[2]*1.25)
    return obj

def layer(name,z0,z1,radius,mat,parent,a0,arc,grain=False):
    # Dense, irregular concentric surfaces with explicit radial caps. No cylinder primitive.
    ns=max(30,int(320*arc/(math.pi*2)));nz=18 if grain else 8;verts=[];faces=[];uvs=[]
    def radius_at(a,z):return radius+.012*math.sin(a*7+z*4)+.006*math.sin(a*23-z*7)+(perturb(math.cos(a)*radius,math.sin(a)*radius,z,.015) if grain else 0)
    def elevation(a,r,z,top):return z+.008*math.sin(a*9+r*4)+perturb(math.cos(a)*r,math.sin(a)*r,z,.014 if grain else .005)
    for j in range(nz+1):
        t=j/nz;z=z0+(z1-z0)*t
        for i in range(ns+1):
            a=a0+arc*i/ns;r=radius_at(a,z)-.012*math.sin(math.pi*t)
            verts.append((math.cos(a)*r,math.sin(a)*r,elevation(a,r,z,j==nz)));uvs.append((a*radius*.36,z*.5))
    for j in range(nz):
        for i in range(ns):
            k=j*(ns+1)+i;faces.append((k,k+1,k+ns+2,k+ns+1))
    # Top and underside use fine annuli, with a softly domed top.
    nr=24
    for side,z in [(0,z0),(1,z1)]:
        offset=len(verts)
        for j in range(nr+1):
            f=max(.00001,j/nr)
            for i in range(ns+1):
                a=a0+arc*i/ns;r=radius_at(a,z)*f
                zz=elevation(a,r,z,side)+(.007*math.sin(math.pi*f) if side else 0)
                verts.append((math.cos(a)*r,math.sin(a)*r,zz));uvs.append((r*math.cos(a)*.8+.5,r*math.sin(a)*.8+.5))
        for j in range(nr):
            for i in range(ns):
                k=offset+j*(ns+1)+i;face=(k,k+1,k+ns+2,k+ns+1);faces.append(tuple(reversed(face)) if side==1 else face)
    obj=make_mesh(name,verts,faces,mat,parent,uvs)
    # Separate tessellated planar cut surfaces keep crisp cut normals and layer alignment.
    for a,flip in ([] if arc>=math.tau-.001 else [(a0,False),(a0+arc,True)]):
        vs=[];fs=[];u=[];nr=60;nh=12
        for j in range(nh+1):
            z=z0+(z1-z0)*j/nh
            for i in range(nr+1):
                r=radius_at(a,z)*i/nr;zz=elevation(a,r,z,j==nh)
                vs.append((math.cos(a)*r,math.sin(a)*r,zz));u.append((r*.36,zz*.5))
        for j in range(nh):
            for i in range(nr):
                k=j*(nr+1)+i;f=(k,k+1,k+nr+2,k+nr+1);fs.append(tuple(reversed(f)) if flip else f)
        make_mesh(name+'_cut',vs,fs,mat,parent,u,smooth=False)
    return obj
for root_name,a0,arc in [('CakeBody',start+length,math.tau-length),('CakeSlice',start,length),('CakeWhole',0,math.tau)]:
    root=roots[root_name]
    for i,(z0,z1) in enumerate([(.06,.48),(.62,1.04),(1.18,1.60)]):layer('Aerated_sponge_'+str(i),z0,z1,1.61,crumb,root,a0,arc,True)
    for i,(z0,z1) in enumerate([(.48,.62),(1.04,1.18)]):layer('Chocolate_cream_'+str(i),z0,z1,1.635,cream,root,a0,arc)
    layer('Ganache_crown',1.60,1.66,1.64,ganache,root,a0,arc)
    # The drape has real thickness, irregular meniscus and non-repeating drip lengths.
    ns=max(20,int(480*arc/math.tau));vs=[];fs=[]
    for j in range(9):
        t=j/8
        for i in range(ns+1):
            a=a0+arc*i/ns
            drops=0
            for k in range(19):
                center=k*math.tau/19+.07*math.sin(k*13);d=math.atan2(math.sin(a-center),math.cos(a-center));drops+=(.045+.12*(.5+.5*math.sin(k*7)))*math.exp(-(d/.041)**2)
            bottom=1.49-drops-.018*math.sin(a*5);z=1.65*(1-t)+bottom*t
            r=1.642+.011*math.sin(math.pi*t)+.009*math.sin(a*7+z*4)
            vs.append((math.cos(a)*r,math.sin(a)*r,z))
    for j in range(8):
        for i in range(ns):
            k=j*(ns+1)+i;fs.append((k+ns+1,k+ns+2,k+1,k))
    drape=make_mesh('Sculpted_ganache_drips',vs,fs,ganache,root)
    solid=drape.modifiers.new('Ganache thickness','SOLIDIFY');solid.thickness=.018
    bpy.context.view_layer.objects.active=drape;bpy.ops.object.modifier_apply(modifier=solid.name)

def root_at(a):
    aa=math.atan2(math.sin(a),math.cos(a));return roots['CakeSlice' if start<=aa<=start+length else 'CakeBody']
# Nine piped chocolate rosettes. A tapered star-nozzle spiral has ridges, not sphere toppings.
for k in range(9):
    a=k*math.tau/9+.15;cx,cy=math.cos(a)*1.26,math.sin(a)*1.26;vs=[];fs=[];steps=160;cross=48
    for j in range(steps+1):
        t=j/steps;turn=t*math.pi*4.2;r=.215*(1-t)**.72;angle=turn+a
        center=Vector((cx+r*math.cos(angle),cy+r*math.sin(angle),1.715+t*.21))
        tangent=Vector((-math.sin(angle),math.cos(angle),.20)).normalized();radial=Vector((math.cos(angle),math.sin(angle),0));other=tangent.cross(radial).normalized();thick=.085*(1-t)**.55+.002
        for i in range(cross):
            b=math.tau*i/cross;flute=1+.21*math.cos(8*b+turn*.14);v=center+thick*flute*(math.cos(b)*radial+math.sin(b)*other);vs.append(tuple(v))
    for j in range(steps):
        for i in range(cross):
            k0=j*cross+i;k1=j*cross+(i+1)%cross;fs.append((k0,k1,k1+cross,k0+cross))
    make_mesh('Piped_chocolate_rosette',vs,fs,cream,root_at(a))
# Thin, broken rolled chocolate shavings. Broad ribbons, not tube coils.
for k in range(42):
    a=random.uniform(0,math.tau);r=random.uniform(.18,.95);cx,cy=math.cos(a)*r,math.sin(a)*r;rotation=random.uniform(0,math.tau);curl=random.uniform(.9,2.8);radius=random.uniform(.05,.13);width=random.uniform(.05,.14);vs=[];fs=[]
    for j in range(28):
        t=j/27;theta=t*curl*math.pi
        for i in range(4):
            w=(i/3-.5)*width*(.8+.2*math.sin(t*8));x=radius*math.sin(theta);y=w;z=1.70+radius*(1-math.cos(theta))+.03*t
            vs.append((cx+x*math.cos(rotation)-y*math.sin(rotation),cy+x*math.sin(rotation)+y*math.cos(rotation),z))
    for j in range(27):
        for i in range(3):
            q=j*4+i;fs.append((q,q+1,q+5,q+4))
    obj=make_mesh('Rolled_tempered_shaving',vs,fs,shaving,root_at(a));mod=obj.modifiers.new('Delicate chocolate thickness','SOLIDIFY');mod.thickness=.006;bpy.context.view_layer.objects.active=obj;bpy.ops.object.modifier_apply(modifier=mod.name)
# Sparse irregular edible-gold flakes on chocolate, not a uniform ring.
for k in range(13):
    a=random.uniform(0,math.tau);r=random.uniform(.3,1.1);x,y=math.cos(a)*r,math.sin(a)*r;s=random.uniform(.012,.035)
    make_mesh('Gold_leaf',[(x-s,y,1.69),(x,y-s*.6,1.695),(x+s*.7,y+s*.4,1.70),(x-s*.4,y+s,1.692)],[(0,1,2,3)],gold,root_at(a),smooth=False)
# The intact hero uses an uncut exterior. Duplicate toppings share mesh data.
for root_name in ('CakeBody','CakeSlice'):
    for o in list(roots[root_name].children):
        if any(o.name.startswith(prefix) for prefix in ('Piped_','Rolled_','Gold_leaf')):
            clone=o.copy();bpy.context.collection.objects.link(clone);clone.parent=roots['CakeWhole']
# Board is stationary; cake & slice share one original reference frame.
layer('Champagne_board',-.035,.035,1.86,board,None,0,math.tau)
# One shared mesh per root/material cuts browser draw calls without discarding UVs.
for root in roots.values():
    by_material={}
    for o in list(root.children):
        if o.type=='MESH':by_material.setdefault(o.data.materials[0].name,[]).append(o)
    for name,objects in by_material.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();objects[0].name=root.name+'_'+name.split(' •')[0]
# Export only the asset. Lighting is owned by the website or the offline review renderer.
(ROOT/'work/assets').mkdir(parents=True,exist_ok=True)
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'work/assets/atelier-cake.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'atelier-cake.glb'),export_format='GLB',export_yup=True,export_materials='EXPORT',export_image_format='JPEG',export_jpeg_quality=93)
print('Original review asset exported',OUT/'atelier-cake.glb')

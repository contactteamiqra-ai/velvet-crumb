"""Offline asset review contact frames. These are not website screenshots."""
import bpy,math,sys
from mathutils import Vector
from pathlib import Path
root=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(root/'work/assets/atelier-cake.blend'))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=False
scene.render.resolution_x=900;scene.render.resolution_y=780;scene.render.resolution_percentage=100
scene.world.use_nodes=True;scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.025,.02,.017,1);scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.35
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast'
# Neutral-dark sweep and broad white light are deliberate, not an orange point-light pool.
mat=bpy.data.materials.new('Warm black studio sweep');mat.diffuse_color=(.018,.014,.011,1)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.055));bpy.context.object.data.materials.append(mat)
def light(name,pos,power,size,color=(1,.94,.84)):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color;ob=bpy.data.objects.new(name,data);scene.collection.objects.link(ob);ob.location=pos;ob.rotation_euler=(Vector((0,0,.8))-ob.location).to_track_quat('-Z','Y').to_euler()
light('Large silk key',(-3,-4,6),650,4)
light('Vertical ganache strip',(3,2,4),850,2,(1,.93,.84))
light('Cool gentle bounce',(1,-4,2),75,3,(.82,.9,1))
data=bpy.data.cameras.new('Chocolate portrait 70mm');cam=bpy.data.objects.new('Chocolate portrait 70mm',data);scene.collection.objects.link(cam);cam.location=(4,-7,4);cam.rotation_euler=(Vector((0,0,.8))-cam.location).to_track_quat('-Z','Y').to_euler();data.lens=62;scene.camera=cam
out=root/'work/review';out.mkdir(exist_ok=True)
for name,distance in [('hero',0),('cut',.85)]:
    bpy.data.objects['CakeWhole'].hide_render=distance>0
    for o in bpy.data.objects['CakeWhole'].children:o.hide_render=distance>0
    for name0 in ['CakeBody','CakeSlice']:
        for o in bpy.data.objects[name0].children:o.hide_render=distance==0
    sl=bpy.data.objects['CakeSlice'];mid=math.radians(-64);sl.location=(math.cos(mid)*distance,math.sin(mid)*distance,-.05*distance);sl.rotation_euler[2]=-.025*distance
    scene.render.filepath=str(out/(name+'-blender.png'));bpy.ops.render.render(write_still=True)

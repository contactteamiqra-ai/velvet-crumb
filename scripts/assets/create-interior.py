"""Author deterministic multiscale crumb and cut-cream PBR maps from scratch.
These are authored surfaces, not photographic scan data. Review against the scan.
"""
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter, zoom
from PIL import Image
out=Path(__file__).resolve().parents[2]/'assets/source/cake';out.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(731);size=1536
# Graded moist crumb, with non-uniform gas pockets and torn edges at multiple scales.
def field(grid):
    n=rng.random((grid,grid));v=zoom(n,size/grid,order=3)[:size,:size];return (v-v.mean())/(v.std()+1e-6)
mottled=field(24)*.4+field(72)*.3+field(240)*.17
pores=np.zeros((size,size),np.float32)
for _ in range(18000):
    x,y=rng.integers(0,size,2);radius=rng.choice([1,2,3,4,6,10,15],p=[.28,.24,.20,.14,.08,.04,.02]);rx=radius*rng.uniform(.65,1.55);ry=radius*rng.uniform(.6,1.3);extent=int(max(rx,ry)*2)+2
    y0,y1=max(0,y-extent),min(size,y+extent);x0,x1=max(0,x-extent),min(size,x+extent)
    yy,xx=np.mgrid[y0:y1,x0:x1];d=((xx-x)/rx)**2+((yy-y)/ry)**2
    pores[y0:y1,x0:x1]=np.maximum(pores[y0:y1,x0:x1],np.exp(-d*1.9)*rng.uniform(.35,1))
fine=rng.normal(0,.024,(size,size));height=.55+mottled*.07-pores*.25+fine
# Heights are measured in the asset preparation script; update after scan inspection.
y=np.linspace(1,0,size)[:,None];cream=np.zeros((size,size),bool)
for level in [.29,.58]:
    waviness=(np.sin(np.arange(size)/47)*.002+np.sin(np.arange(size)/113)*.003)[None,:]
    cream|=np.abs(y-level-waviness)<.036
base=np.stack([.34+mottled*.032,.17+mottled*.022,.078+mottled*.014],axis=-1)
base*=1-pores[...,None]*.72
Image.fromarray((np.clip(base,0,1)*255).astype('uint8')).save(out/'crumb-color.jpg',quality=94)
crumb_height=height.copy()
crumb_roughness=.86+pores*.10+mottled*.02
dy,dx=np.gradient(crumb_height);cn=np.stack([-dx*6,dy*6,np.ones_like(dx)],axis=-1);cn/=np.linalg.norm(cn,axis=-1,keepdims=True)
Image.fromarray(((cn*.5+.5)*255).astype('uint8')).save(out/'crumb-normal.jpg',quality=94)
Image.fromarray((np.clip(crumb_roughness,0,1)*255).astype('uint8')).save(out/'crumb-roughness.jpg',quality=92)
creamcolor=np.stack([.49+mottled*.015,.29+mottled*.012,.17+mottled*.009],axis=-1)
base=np.where(cream[...,None],creamcolor,base)
height=np.where(cream,.52+gaussian_filter(mottled,4)*.009+fine*.15,height)
roughness=np.where(cream,.49+mottled*.015,.83+pores*.12+mottled*.025)
dy,dx=np.gradient(height);normal=np.stack([-dx*6,dy*6,np.ones_like(dx)],axis=-1);normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
Image.fromarray((np.clip(base,0,1)*255).astype('uint8')).save(out/'interior-color.jpg',quality=94)
Image.fromarray((np.clip(roughness,0,1)*255).astype('uint8')).save(out/'interior-roughness.jpg',quality=93)
Image.fromarray(((normal*.5+.5)*255).astype('uint8')).save(out/'interior-normal.jpg',quality=96)
print('Created original interior PBR texture set:',out)
# Subtle trowel marks and micro-roughness distinguish emulsion from dry crumb.
for prefix,amplitude,rough in [('cream',3,.41),('ganache',1.5,.25)]:
    h=gaussian_filter(mottled,4)+np.sin(np.arange(size)[None,:]/18)*.18
    dy,dx=np.gradient(h);n=np.stack([-dx*amplitude,dy*amplitude,np.ones_like(dx)],axis=-1);n/=np.linalg.norm(n,axis=-1,keepdims=True)
    Image.fromarray(((n*.5+.5)*255).astype('uint8')).save(out/(prefix+'-normal.jpg'),quality=90)
    Image.fromarray((np.clip(rough+h*.025,0,1)*255).astype('uint8')).save(out/(prefix+'-roughness.jpg'),quality=90)

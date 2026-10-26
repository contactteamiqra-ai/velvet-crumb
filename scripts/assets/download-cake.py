"""Fetch the selected CC0 asset through Poly Haven's documented public API.
Requires api.polyhaven.com and the download host in the environment allowlist.
All dependencies are saved locally; the website never calls this API.
"""
import hashlib,json,urllib.request
from pathlib import Path
asset='strawberry_chocolate_cake'
root=Path(__file__).resolve().parents[2]
out=root/'work/assets/polyhaven';out.mkdir(parents=True,exist_ok=True)
headers={'User-Agent':'VelvetCrumb-AssetPreparation/1.0 (CC0 asset download)'}
def fetch(url):
    request=urllib.request.Request(url,headers=headers)
    with urllib.request.urlopen(request,timeout=90) as response:return response.read()
metadata=json.loads(fetch(f'https://api.polyhaven.com/files/{asset}'))
(out/'files.json').write_text(json.dumps(metadata,indent=2))
entry=metadata['gltf']['2k']['gltf']
url=entry['url'];name=url.rsplit('/',1)[1]
records=[]
def save(url,path):
    path.parent.mkdir(parents=True,exist_ok=True);data=fetch(url);path.write_bytes(data)
    records.append({'url':url,'file':str(path.relative_to(out)),'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
save(url,out/name)
for relative,info in entry.get('include',{}).items():
    path=(out/relative).resolve()
    if not path.is_relative_to(out.resolve()):raise ValueError('Unexpected dependency path')
    save(info['url'],path)
manifest={'asset':asset,'author':'Kuutti Siitonen','source':f'https://polyhaven.com/a/{asset}','license':'CC0-1.0','license_url':'https://polyhaven.com/license','files':records}
(out/'provenance.json').write_text(json.dumps(manifest,indent=2))
print('SOURCE_GLTF',out/name)

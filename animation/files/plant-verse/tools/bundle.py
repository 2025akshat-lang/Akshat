#!/usr/bin/env python3
"""js/manifest.js ki order mein saari JS ek file mein jodta hai -> dist/plantverse.bundle.js
Chalane ke liye project folder mein:  python tools/bundle.py   (phir manifest.js mein useBundle:true)"""
import re,os,json
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
m=open(os.path.join(root,'js','manifest.js'),encoding='utf-8').read()
def arr(name):
    mm=re.search(name+r':\s*\[(.*?)\]',m,re.S);return re.findall(r"'([^']+\.js)'",re.sub(r'//[^\n]*','',mm.group(1)))
files=arr('core')+arr('features')+arr('boot')
out=['']
for f in files:
    out.append('\n\n'+open(os.path.join(root,'js',f),encoding='utf-8').read())
os.makedirs(os.path.join(root,'dist'),exist_ok=True)
open(os.path.join(root,'dist','plantverse.bundle.js'),'w',encoding='utf-8').write('\n'.join(out))
print('bundle ready:',len(files),'files')

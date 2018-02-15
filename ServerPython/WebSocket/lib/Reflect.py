
import os
import sys

WORKPATH=''

def reflect(_t_path):
    with open(_t_path,'rb') as _t_f:
        if sys.version_info[0]<3:
            _t_rawCode=_t_f.read()
        else:
            _t_rawCode=''.join((chr(c) for c in _t_f.read()))
        _t_namespace={}
        _t_code=compile(_t_rawCode+'''
__=locals()
for item in dir():
    if item.startswith('__') or item.startswith('_t_'):
        continue
    _t_namespace[item]=__[item]
''',ReflectTmpFilepath,'exec')
        eval(_t_code)
        g=globals()
        for key,val in _t_namespace.items():
            if not key in g:
                g[key]=val
        return _t_namespace
def setworkpath(path):
    global WORKPATH
    WORKPATH=path

ReflectTmpFilepath=os.path.join(os.path.dirname(os.path.realpath(__file__)),'Reflect.tmp')
if not os.path.exists(ReflectTmpFilepath):
    with open(ReflectTmpFilepath,'wb') as f:
        pass

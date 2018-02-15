
class Properties(object):
    def __init__(self,param):
        if not isinstance(param,dict):
            raise TypeError('param must be instance of dict')
        for key,value in param.items():
            setattr(self,key,value)
    def merge(self,props):
        if not isinstance(props,Properties):
            raise TypeError('param must be instance of Properties')
        for key,value in props:
            setattr(self,key,value)
    def has(self,key):
        try:
            _=getattr(self,key)
            return True
        except Exception as e:
            print(e)
            return False
    def __iter__(self):
        for item in dir(self):
            if item.startswith('__') and item.endswith('__') or item is 'merge':
                continue
            else:
                yield (item,getattr(self,item))
    def __str__(self):
        return 'Properties instance:\n\t'+'\n\t'.join([item[0]+':'+str(item[1]) for item in self])

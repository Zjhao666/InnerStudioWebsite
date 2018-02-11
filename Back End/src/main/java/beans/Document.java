package beans;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import javax.activation.MimetypesFileTypeMap;
import net.sf.json.JSONObject;

public class Document {
    public String GetTargetpathDoc(String targetpath)
    {
        try{
            File dir = new File(targetpath);
            String names[] = dir.list();
            List<JSONObject> list = new ArrayList<>();
            for(String name : names)
            {
                File f = new File(targetpath+"\""+name);
                JSONObject json = new JSONObject();
                JSONObject content = new JSONObject();
                if(f == null)
                {
                    json.put("statuscode", "201");
                    content.put("name", null);
                    content.put("isDir", null);
                    json.put("content", content);
                }
                else if(!"doc".equals(new MimetypesFileTypeMap().getContentType(f)))
                {
                    json.put("statuscode", "202");
                    content.put("name", f.getName());
                    content.put("isDir", false);
                    json.put("content", content);
                }
                else{
                    json.put("statuscode", "200");
                    content.put("name", f.getName());
                    content.put("isDir", true);
                    json.put("content", content);
                }
                list.add(json);
            }
            JSONObject jobj = JSONObject.fromObject(list);
            return jobj.toString();
        }catch(Exception e)
        {
            System.err.println(e);
            return null;
        }
    }
    
    public void uploadDoc(InputStream f, String name, String path)
    {
        try{
            InputStream in = f;
            String fileName = path + name;
            File file = new File(fileName);
            file.createNewFile();
            byte[] buffer = new byte[1024];
            OutputStream out = new FileOutputStream(fileName);
            int len;
            while((len = in.read(buffer))!=-1)
            {
                out.write(buffer, 0, len);
            }
            out.close();
            in.close();
        }catch(FileNotFoundException e)
        {
            System.err.println(e);
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }
    
    public void uploadDoc2(InputStream f, String name, String path)//temporary document
    {
        try{
            int i;
            for(i = 1; new File(name + i).exists() ;i++){}
            name += i;
            InputStream in = f;
            String fileName = path + name;
            File file = new File(fileName);
            file.createNewFile();
            byte[] buffer = new byte[1024];
            OutputStream out = new FileOutputStream(fileName);
            int len = 0;
            while((len = in.read(buffer))!=-1)
            {
                out.write(buffer, 0, len);
            }
            out.close();
            in.close();
        }catch(FileNotFoundException e)
        {
            System.err.println(e);
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }
    
    public String downloadDoc(String targetpath) throws FileNotFoundException, IOException
    {
        try{
            File file = new File(targetpath);
            InputStream fis = new FileInputStream(file);
            BufferedInputStream bis = new BufferedInputStream(fis);
            int i;
            byte[] b = new byte[1024];
            String s =null;
            while((i = bis.read(b))!=-1)
            {
                s += new String(b, 0, i);
            }
            return s;
        }catch(IOException e)
        {
            System.err.println(e);
            return null;
        }
    }
    
    
    
    public String DocFileDetail(String targetpath)
    {
        try{
            JSONObject data = new JSONObject();
            File file = new File(targetpath);
            String name = file.getName();
            data.put("title", name.substring(0,name.lastIndexOf(".")));
            data.put("type", name.substring(name.lastIndexOf(".")+1));
            data.put("size",file.length());
            data.put("uploadTime", file.lastModified());
            return data.toString();
        }catch(Exception e)
        {
            System.err.println(e);
            return null;
        }
    }
    
    public int DocDelete(String targetpath) 
    {
        try{
            if(!targetpath.startsWith("/home/doc"))
            {
                return 201;
            }
            else
            {
                File file = new File(targetpath);
                if(!file.exists())
                {
                    return 202;
                }
                else{
                    file.delete();
                    return 200;
                }
            }
        }catch(Exception e){
            System.err.println(e);
            return -1;
        }
    }
}

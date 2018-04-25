package com.mobileai.luncert.util;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import net.sf.cglib.beans.BeanGenerator;

public class GenerateClass {

    public static Object fromFields(Map<String, Class> fields) {
        BeanGenerator generator = new BeanGenerator();
        Set<String> keySet = fields.keySet();
        Iterator<String> iter = keySet.iterator();
        while (iter.hasNext()) {
            String key = (String) iter.next();
            generator.addProperty(key, (Class) fields.get(key));
        }
        return generator.create();
    }

}
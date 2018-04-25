package com.mobileai.luncert.util;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.springframework.context.annotation.Configuration;

@RunWith(JUnit4.class)
@Configuration
public class testGenerateClass {
    @Test
    public void test() {
        Map<String, Class> field = new HashMap<String, Class>(){{
            put("id", int.class);
            put("content", String.class);
            put("endTime", String.class);
        }};
        Object o = GenerateClass.fromFields(field);
        System.out.println(o);
    }
}
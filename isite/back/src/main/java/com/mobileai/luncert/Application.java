package com.mobileai.luncert;


import java.io.IOException;

import com.mobileai.luncert.interceptor.AuthInterceptor;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@MapperScan("com.mobileai.luncert.mapper")
@ComponentScan("com.mobileai.luncert")
@EnableAspectJAutoProxy
@Configuration
public class Application extends WebMvcConfigurerAdapter {

	private final int MAXFILESIZE = 2097152; // 2MB
	
	@Bean
	public MultipartResolver multipartResolver() throws IOException {
		CommonsMultipartResolver resolver = new CommonsMultipartResolver();
		resolver.setUploadTempDir(new FileSystemResource("/home/luncert/Desktop"));
		resolver.setMaxUploadSize(MAXFILESIZE);
		resolver.setMaxInMemorySize(40960);
		return resolver;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		InterceptorRegistration interceptorRegistration = registry.addInterceptor(new AuthInterceptor());
		interceptorRegistration.addPathPatterns("/today/task");
	}

	/*
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/res/headimg/**").addResourceLocations("classpath:/res/headimg/");
		super.addResourceHandlers(registry);
	}
	*/

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}

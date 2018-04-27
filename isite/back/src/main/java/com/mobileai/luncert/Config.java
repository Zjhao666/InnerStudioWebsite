package com.mobileai.luncert;


import java.io.IOException;

import com.mobileai.luncert.interceptor.AuthInterceptor;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@MapperScan("com.mobileai.luncert.mapper")
@ComponentScan(basePackages = {"com.mobileai.luncert"})
@EnableWebMvc
@Configuration
public class Config implements WebMvcConfigurer {

	private final int MAXFILESIZE = 2097152; // 2MB
	
	@Bean
	public MultipartResolver multipartResolver() throws IOException {
		CommonsMultipartResolver resolver = new CommonsMultipartResolver();
		resolver.setUploadTempDir(new FileSystemResource("/home/luncert/Desktop"));
		resolver.setMaxUploadSize(MAXFILESIZE);
		resolver.setMaxInMemorySize(40960);
		return resolver;
	}

	@Bean
	public AuthInterceptor authInterceptor() {
		// note spring doesn't response to manage customized Interceptor
		return new AuthInterceptor();
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		InterceptorRegistration registration = registry.addInterceptor(authInterceptor());
		registration.addPathPatterns("/today/task/*");
	}

	/*
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/res/headimg/**").addResourceLocations("classpath:/res/headimg/");
		super.addResourceHandlers(registry);
	}
	*/

}
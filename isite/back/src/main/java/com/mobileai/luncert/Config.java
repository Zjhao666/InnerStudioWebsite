package com.mobileai.luncert;


import java.io.IOException;

import javax.servlet.MultipartConfigElement;

import com.mobileai.luncert.interceptor.AuthInterceptor;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@MapperScan("com.mobileai.luncert.mapper")
@ComponentScan(basePackages = {"com.mobileai.luncert"})
@EnableWebMvc
@Configuration
public class Config implements WebMvcConfigurer {

	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize("2MB");
		factory.setMaxRequestSize("10MB");
		return factory.createMultipartConfig();
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

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
	}

}
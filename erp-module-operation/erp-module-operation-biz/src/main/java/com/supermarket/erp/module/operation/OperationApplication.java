package com.supermarket.erp.module.operation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.supermarket.erp")
@MapperScan("com.supermarket.erp.module.operation.dal.mysql")
public class OperationApplication {

    public static void main(String[] args) {
        SpringApplication.run(OperationApplication.class, args);
    }
}

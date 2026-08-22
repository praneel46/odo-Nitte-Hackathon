# Multi-stage Dockerfile for Spring Boot 3.3.2 + Java 21 Backend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Ensure upload directory exists
RUN mkdir -p ./uploads/documents

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:dayflow.db
ENV APP_UPLOAD_DIR=./uploads/documents

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

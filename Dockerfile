# Multi-stage Dockerfile for Spring Boot 3.3.2 + Java 21 Backend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Persistent storage directory
RUN mkdir -p /var/data/uploads

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/var/data/dayflow.db
ENV APP_UPLOAD_DIR=/var/data/uploads

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

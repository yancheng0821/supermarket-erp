FROM maven:3.9.11-eclipse-temurin-17 AS builder

ARG MODULE_PATH

WORKDIR /workspace
COPY . .

RUN test -n "${MODULE_PATH}"
RUN mvn -B -ntp -pl "${MODULE_PATH}" -am -DskipTests package
RUN cp "${MODULE_PATH}"/target/*.jar /tmp/app.jar

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=builder /tmp/app.jar /app/app.jar

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app/app.jar"]

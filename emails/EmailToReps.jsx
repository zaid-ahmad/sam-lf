import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
    Link,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

export const EmailToReps = ({
    saleRepName,
    customerName,
    customerPhone,
    customerAddress,
    customerQuadrant,
    leadId,
}) => {
    return (
        <Html>
            <Head />
            <Preview>A new lead has been assigned to you.</Preview>
            <Body style={main}>
                <Container>
                    <Section style={logo}>
                        <Img
                            src={`https://lf-sam-appointment-images.s3.ca-central-1.amazonaws.com/lf-logo.png`}
                            width={300}
                        />
                    </Section>

                    <Section style={content}>
                        <Row style={{ ...boxInfos, paddingBottom: "0" }}>
                            <Column>
                                <Heading
                                    style={{
                                        fontSize: 26,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Hi {saleRepName},
                                </Heading>
                                <Heading
                                    as='h2'
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "normal",
                                        textAlign: "center",
                                    }}
                                >
                                    A new lead has been assigned to you.
                                </Heading>
                                <Text style={{ ...paragraph, marginTop: 25 }}>
                                    <b>Customer Name: </b>
                                    {customerName}
                                </Text>
                                <Text style={{ ...paragraph, marginTop: -5 }}>
                                    <b>Phone: </b>
                                    {customerPhone}
                                </Text>
                                <Text style={{ ...paragraph, marginTop: -5 }}>
                                    <b>Address: </b>
                                    {customerAddress}
                                </Text>
                                <Text style={{ ...paragraph, marginTop: -5 }}>
                                    <b>Quadrant: </b>
                                    {customerQuadrant}
                                </Text>
                                <Link href={`${baseUrl}/leads/${leadId}`}>
                                    Click here to view more details.
                                </Link>

                                <Text style={paragraph}>
                                    For further actions, please log in to the
                                    dashboard.
                                </Text>
                            </Column>
                        </Row>
                        <Row style={{ ...boxInfos, paddingTop: "0" }}>
                            <Column style={containerButton} colSpan={2}>
                                <Button
                                    style={button}
                                    href={`${baseUrl}/dashboard`}
                                >
                                    Login to SAM 2.0
                                </Button>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailToReps;

const main = {
    backgroundColor: "#fff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
    fontSize: 16,
};

const logo = {
    display: "flex",
    justifyContent: "center",
    padding: "30px 20px",
};

const containerButton = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
};

const button = {
    backgroundColor: "#00a74f",
    borderRadius: 3,
    color: "#FFF",
    fontWeight: "normal",
    border: "1px solid rgb(0,0,0, 0.1)",
    cursor: "pointer",
    padding: "12px 24px",
};

const content = {
    border: "1px solid rgb(0,0,0, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
};

const image = {
    maxWidth: "100%",
};

const boxInfos = {
    padding: "20px",
};

const containerImageFooter = {
    padding: "45px 0 0 0",
};

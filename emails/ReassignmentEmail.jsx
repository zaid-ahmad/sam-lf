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

export const ReassignmentEmail = ({ salesRepName }) => {
    return (
        <Html>
            <Head />
            <Preview>Oops.. this lead was assigned to you by mistake.</Preview>
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
                                        fontSize: 24,
                                        fontWeight: "bold",
                                        textAlign: "left",
                                    }}
                                >
                                    Hi {salesRepName},
                                </Heading>
                                <Heading
                                    as='h2'
                                    style={{
                                        fontSize: 18,
                                        textAlign: "left",
                                        fontWeight: "normal",
                                    }}
                                >
                                    This is to inform you that the lead assigned
                                    to you has been reassigned to another
                                    representative. This was an error on our
                                    part, and we kindly ask you to disregard it.
                                </Heading>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ReassignmentEmail;

const main = {
    backgroundColor: "#fff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const logo = {
    display: "flex",
    justifyContent: "left",
    padding: "30px 20px",
};
const content = {
    border: "1px solid rgb(0,0,0, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
};

const boxInfos = {
    padding: "20px",
};

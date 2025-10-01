import {
    Html,
    Head,
    Font,
    Preview,
    Section,
    Row,
    Heading,
    Text,
    Container,
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    format: "woff2",
                }}
                fontWeight={400}
                fontStyle="normal"
            />

            <Preview>Here’s your verification code: {otp}</Preview>

            <Container style={{ padding: "20px", fontFamily: "Roboto, Verdana, sans-serif" }}>
                <Section>
                    <Row>
                        <Heading as="h2">Hello {username},</Heading>
                    </Row>

                    <Row>
                        <Text>
                            Thank you for registering. Please use the following verification
                            code to complete your registration:
                        </Text>
                    </Row>

                    <Row>
                        <Text
                            style={{
                                fontSize: "22px",
                                fontWeight: "bold",
                                letterSpacing: "2px",
                                margin: "16px 0",
                            }}
                        >
                            {otp}
                        </Text>
                    </Row>

                    <Row>
                        <Text>
                            If you did not request this code, you can safely ignore this email.
                        </Text>
                    </Row>
                </Section>
            </Container>
        </Html>
    );
}

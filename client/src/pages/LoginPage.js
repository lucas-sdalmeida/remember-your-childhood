import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const LoginPage = () => {
    return (
        <Container fluid='xl'>
            <Row md='1'>
                <Col md='auto'>
                    <Form>
                        <Form.Group controlId='emailOrUsername'>
                            <Form.Label>Email ou Username:</Form.Label>
                            <Form.Control type='text' placeholder='Digite o e-mail ou o username'></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='emailOrUsername'>
                            <Form.Label>Senha:</Form.Label>
                            <Form.Control type='text' placeholder='Digite a senha'></Form.Control>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage

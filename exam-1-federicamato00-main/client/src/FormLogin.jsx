import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap"
import { LoginForm } from "./Auth";


function FormLogin(props) {

    return (
        <Row className="vh-100">
          <Col md={12} className="below-nav">
            <LoginForm login={props.login} />
          </Col>
        </Row>
      );
}

export {FormLogin}
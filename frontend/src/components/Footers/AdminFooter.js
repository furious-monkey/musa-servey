import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="3">
          <div className="copyright text-center text-xl-left text-muted">
          </div>
        </Col>
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted" style={{textAlignLast: 'center'}}>
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href=""
              rel="noopener noreferrer"
              target="_blank"
            >
              musabasketballapparels.com
            </a>
          </div>
        </Col>
        <Col xl="3">
          <div className="copyright text-center text-xl-left text-muted">
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;

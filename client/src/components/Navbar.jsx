import { useContext } from "react";
import { Container, Nav, Navbar as MyNav, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Notifications from "./Chats/Notifications";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <>
      <MyNav bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
        <Container>
          <h2>
            <Link to={"/"} className="link-light text-decoration-none">
              ChatApp
            </Link>
          </h2>
          {user && (
            <span className="text-warning">Logged in as {user.name}</span>
          )}
          <Nav>
            <Stack direction="horizontal" gap={3}>
              {user ? (
                <>
                  <Notifications />
                  <Link
                    to={"/login"}
                    className="link-light text-decoration-none"
                    onClick={() => logoutUser()}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="link-light text-decoration-none"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/register"}
                    className="link-light text-decoration-none"
                  >
                    Register
                  </Link>
                </>
              )}
            </Stack>
          </Nav>
        </Container>
      </MyNav>
    </>
  );
};

export default Navbar;

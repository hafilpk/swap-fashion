import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded-4" style={{ maxWidth: "600px" }}>
        <h2 className="fw-bold mb-4 text-success">
          Join the Fashion Swap Revolution!
        </h2>
        <p className="text-muted mb-4">
          Swap your wardrobe, explore unique styles, and contribute to a more sustainable future in fashion.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register" className="btn btn-success btn-lg px-4">
            Register
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

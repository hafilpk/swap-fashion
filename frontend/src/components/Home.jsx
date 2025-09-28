function Home() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl mb-4">Join the swap revolution!</h2>
      <div>
        <a
          href="/register"
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Register
        </a>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </a>
      </div>
    </div>
  );
}
export default Home;
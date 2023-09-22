function status(request, response) {
  response.status(200).json({
    msg: "I'm so phoda!",
  });
}

export default status;

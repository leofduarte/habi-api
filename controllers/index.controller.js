exports.getHomePage = (req, res) => {
    res.render('index', { title: 'Express' });
  };
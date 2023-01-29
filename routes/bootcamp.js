const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {getBootcamp,
       getBootcamps,
       createBootcamp,
       updateBootcamp,
       deleteBootcamp
} = require('../controllers/bootcamp');

router.route('/').get(getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect , updateBootcamp).delete(protect ,deleteBootcamp);

module.exports = router;
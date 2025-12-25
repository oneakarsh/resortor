const Resort = require('../models/Resort');

exports.getAllResorts = async (req, res) => {
  try {
    const { amenities, minRate, maxRate, location } = req.query;

    const filter = { isActive: true };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (amenities) {
      let amenArray = [];
      if (typeof amenities === 'string') {
        try {
          const parsed = JSON.parse(amenities);
          if (Array.isArray(parsed)) amenArray = parsed;
        } catch (e) {
          amenArray = amenities.split(',').map((a) => a.trim()).filter(Boolean);
        }
      } else if (Array.isArray(amenities)) {
        amenArray = amenities;
      }

      if (amenArray.length) {
        filter.amenities = { $all: amenArray };
      }
    }

    if (minRate || maxRate) {
      const priceFilter = {};
      if (minRate && !Number.isNaN(Number(minRate))) priceFilter.$gte = Number(minRate);
      if (maxRate && !Number.isNaN(Number(maxRate))) priceFilter.$lte = Number(maxRate);
      if (Object.keys(priceFilter).length) filter.pricePerNight = priceFilter;
    }

    const resorts = await Resort.find(filter);

    res.json({ message: 'Resorts fetched successfully', count: resorts.length, data: resorts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resorts', error: error.message });
  }
};

exports.getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.json({ data: resort });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resort', error: error.message });
  }
};

exports.createResort = async (req, res) => {
  try {
    const { name, description, location, pricePerNight, amenities, maxGuests, rooms, image } =
      req.body;

    if (!name || !description || !location || !pricePerNight || !maxGuests || !rooms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const resort = new Resort({
      name,
      description,
      location,
      pricePerNight,
      amenities,
      maxGuests,
      rooms,
      image,
    });

    await resort.save();
    res.status(201).json({ message: 'Resort created successfully', data: resort });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resort', error: error.message });
  }
};

exports.updateResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.json({ message: 'Resort updated successfully', data: resort });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update resort', error: error.message });
  }
};

exports.deleteResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.json({ message: 'Resort deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resort', error: error.message });
  }
};

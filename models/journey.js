const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({

    direction: {
        bounds: {
            northeast: {
                lat: {
                    type: Number
                },
                lng: {
                    type: Number
                }
            },
            southwest: {
                lat: {
                    type: Number
                },
                lng: {
                    type: Number
                }
            }
        },
        distance: {
            text: {
                type: String
            },
            value: {
                type: Number
            }
        },
        duration: {
            text: {
                type: String
            },
            value: {
                type: Number
            }
        },
        end_address: {
            type: String
        },
        end_location: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        },
        points: {
            type: String
        },
        start_address: {
            type: String
        },
        start_location: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        },
        status: {
            type: String
        }
    },
    journey: {
        content: {
            type: String
        },
        destination: {
            address: {
                type: String
            },
            id: {
                type: String
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            },
            name: {
                type: String
            }
        },
        id: {
            type: String
        },
        origin: {
            address: {
                type: String
            },
            id: {
                type: String
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            },
            name: {
                type: String
            }
        },
        title: {
            type: String
        }
    },
    tracked_locations: {
        type: String
    },
    user: {
        birthday: {
            type: Number
        },
        email: {
            type: String
        },
        family_name: {
            type: String
        },
        gender: {
            type: String
        },
        given_name: {
            type: String
        },
        id: {
            type: String
        },
        photo: {
            type: String
        }
    }
});

const journey = mongoose.model('journey', journeySchema);

module.exports = journey;
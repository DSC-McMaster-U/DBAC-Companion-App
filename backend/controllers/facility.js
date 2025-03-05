import { db } from '../firebase.js';

export const getFacilityCapacityInfo = async (req, res) => {
    try {
        // Support both GET and POST methods
        const facility = req.method === 'GET' ? req.query.facility : req.body.facility;

        if (!facility) {
            return res.status(400).json({
                error: 'Facility parameter is required'
            });
        }

        const facilityRef = db.collection('facilities').doc(facility);
        const facilitySnap = await facilityRef.get();

        if (!facilitySnap.exists()) {
            return res.status(404).json({
                error: `Facility ${facility} not found`
            });
        }

        const facilityData = facilitySnap.data();

        if (facilityData.num_active_users === undefined || 
            facilityData.capacity === undefined ) {
            return res.status(500).json({
                error: 'Facility data is incomplete'
            });
        }


        // Rename/add to this when new variables/maps are created in firestore
        res.status(200).json({
            num_active_users: facilityData.num_active_users,
            capacity: facilityData.capacity,
        });

    } catch (error) {
        console.error('Error in getFacilityCapacityInfo:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getMachineCapacityInfo = async (req, res) => {
    try {
        // Support both GET and POST methods
        const facility = req.method === 'GET' ? req.query.facility : req.body.facility;

        if (!facility) {
            return res.status(400).json({
                error: 'Facility parameter is required'
            });
        }

        const facilityRef = db.collection('facilities').doc(facility);
        const facilitySnap = await facilityRef.get();

        if (!facilitySnap.exists()) {
            return res.status(404).json({
                error: `Facility ${facility} not found`
            });
        }

        const facilityData = facilitySnap.data();

        if (facilityData.num_cardio === undefined ||
            facilityData.num_free_weights === undefined ||
            facilityData.num_machines === undefined ||
            facilityData.occupied_machine_count === undefined ||
            facilityData.occupied_cardio_count === undefined ||
            facilityData.occupied_free_weight_count === undefined) {
            return res.status(500).json({
                error: 'Machine data is incomplete'
            });
        }


        // Rename/add to this when new variables/maps are created in firestore
        res.status(200).json({
            num_cardio: {
                stairmaster: facilityData.num_cardio.stairmaster,
                treadmill: facilityData.num_cardio.treadmill
            },
            num_free_weights: {
                dumbells: facilityData.num_free_weights.dumbells,
                barbells: facilityData.num_free_weights.barbells
            },
            num_machines: {
                bench_press: facilityData.num_machines.bench_press,
                lat_pull_down: facilityData.num_machines.lat_pull_down,
                pull_up_bar: facilityData.num_machines.pull_up_bar
            },
            occupied_machine_count: {
                bench_press: facilityData.occupied_machine_count.bench_press,
                lat_pull_down: facilityData.occupied_machine_count.lat_pull_down,
                pull_up_bar: facilityData.occupied_machine_count.pull_up_bar                
            },
            occupied_cardio_count: {
                stairmaster: facilityData.occupied_cardio_count.stairmaster,
                treadmill: facilityData.occupied_cardio_count.treadmill
            },
            occupied_free_weight_count: {
                dumbells: facilityData.occupied_free_weight_count.dumbells,
                barbells: facilityData.occupied_free_weight_count.barbells
            }
        });

    } catch (error) {
        console.error('Error in getMachineCapacityInfo:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
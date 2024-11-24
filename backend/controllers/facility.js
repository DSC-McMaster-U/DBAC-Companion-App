import { db } from '../firebase.js';
import { doc, getDoc } from "firebase/firestore";

export const getMachineCapacityInfo = async (req, res) => {
    try {
        const { facility, machine_type } = req.method === 'GET' ? req.query : req.body;

        if (!facility || !machine_type) {
            return res.status(400).json({
                error: 'Both facility and machine_type parameters are required'
            });
        }

        const facilityRef = doc(db, "facilities", facility);
        const facilitySnap = await getDoc(facilityRef);

        if (!facilitySnap.exists()) {
            return res.status(404).json({
                error: `Facility ${facility} not found`
            });
        }

        const facilityData = facilitySnap.data();

        if (!facilityData.occupied_machine_count?.[machine_type] !== undefined ||
            !facilityData.num_machines?.[machine_type] !== undefined) {
            return res.status(404).json({
                error: `Machine type ${machine_type} not found in facility ${facility}`
            });
        }

        const num_occupied = facilityData.occupied_machine_count[machine_type];
        const total_num_machines = facilityData.num_machines[machine_type];

        res.status(200).json({
            num_occupied,
            total_num_machines
        });
    } catch (error) {
        console.error('Error in getMachineCapacityInfo:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getFacilityCapacityInfo = async (req, res) => {
    try {
        // Support both GET and POST methods
        const facility = req.method === 'GET' ? req.query.facility : req.body.facility;

        if (!facility) {
            return res.status(400).json({
                error: 'Facility parameter is required'
            });
        }

        const facilityRef = doc(db, "facilities", facility);
        const facilitySnap = await getDoc(facilityRef);

        if (!facilitySnap.exists()) {
            return res.status(404).json({
                error: `Facility ${facility} not found`
            });
        }

        const facilityData = facilitySnap.data();

        if (facilityData.num_active_users === undefined ||
            facilityData.capacity === undefined) {
            return res.status(500).json({
                error: 'Facility data is incomplete'
            });
        }

        res.status(200).json({
            num_active_users: facilityData.num_active_users,
            capacity: facilityData.capacity
        });
    } catch (error) {
        console.error('Error in getFacilityCapacityInfo:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
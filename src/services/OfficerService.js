import { api } from "./api";

class OfficerService {

    async getById(officer) {
        
        const result = await api.get(`/officer/${officer.id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getOfficers() {
        const result = await api.get('/officer', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getOfficersWithTeams() {

        const officers = await api.get('/officer', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });

        const teams = await api.get('/team', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });

        // Create a mapping of teams by their id
        const teamMap = new Map();

        teams.data.forEach(team => {
            teamMap.set(team.id, team);
        });

        // Create a new array of officers with the nested team information
        const officersWithTeams = officers.data.map(officer => {
            const team = teamMap.get(officer.team_id);
            if (team) {
                // If a matching team is found, create a new object with the nested structure
                return {
                    ...officer,
                    team: {
                        id: team.id,
                        team_name: team.team_name,
                        status: team.status,
                        createdAt: team.createdAt,
                        updatedAt: team.updatedAt
                    }
                };
            } else {
                // If no matching team is found, simply return the officer object
                return officer;
            }
        });

        return officersWithTeams;
    }

    async getAllOfficersFromOperation(data) {
        const operation_id = data.id;

        const officerOperation = await api.get(`/officeroperation/operation/${operation_id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return officerOperation;

    }

    async deleteOfficer(id) {
        const result = await api.delete(`/officer/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async deleteOfficerOperationByOfficerId(data) {
        const oid = data.id;
        const result = await api.delete(`/officeroperation/officer/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async updateOfficer(data) {
        const result = await api.put(`/officer/${data.id}`, {
            name: data.name,
            team_id: data.team_id,
            status: data.status
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async updateOfficerBasedOnTeam(data) {
        const result = await api.put(`/officer/team/${data.tid}`, {
            name: data.name,
            team_id: data.team_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async bulkUpdateOfficer(officersArray) {

        // Create an array of promises for updating officers
        const updatePromises = officersArray.map((officer) => this.updateOfficer(officer));

        // Use Promise.all to execute all the update promises in parallel
        Promise.all(updatePromises)
            .then((result) => {
                //console.log('All officers updated successfully.');
                return result;
            })
            .catch((error) => {
                console.error(`Error updating officers: ${error}`);
            });

    }

    async createOfficer(data) {
        const result = await api.post('/officer', {
            name: data.name,
            team_id: data.team_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async createOfficerOperation(data) {
        const result = await api.post('/officeroperation', {
            officer_id: data.officer_id,
            operation_id: data.operation_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }


    async deleteOfficerOperation(data) {
        const ofid = data.officer_id;
        const oid = data.operation_id;

        const result = await api.delete(`/officer/${ofid}/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }
}

export default OfficerService;
export const serverUrl = "https://car-control-api.onrender.com";
//export const serverUrl = "http://localhost:8080";


export async function getVehicleJobs(vehicleId: string) {
  try {
    const res = await fetch(`${serverUrl}/jobs/${vehicleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
}

export async function createJob(jobData: unknown) {
  try {
    const response = await fetch(`${serverUrl}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function updateJob(jobId: number, jobData: unknown) {
  try {
    const response = await fetch(`${serverUrl}/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

export async function deleteJob(jobId: number) {
  try {
    const res = await fetch(`${serverUrl}/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete job: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error deleting job:", error);
    return null;
  }
}

// Add vehicle API functions

export async function getVehicles(userId: string) {
  try {
    const response = await fetch(`${serverUrl}/vehicles/${userId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch vehicles")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return null
  }
}

export async function createVehicle(vehicleData: unknown) {
  try {
    const response = await fetch(`${serverUrl}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create vehicle")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating vehicle:", error)
    throw error
  }
}

export async function updateVehicle(vehicleId: string, vehicleData: unknown) {
  try {
    const response = await fetch(`${serverUrl}/vehicles/${vehicleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update vehicle")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating vehicle:", error)
    throw error
  }
}

export async function deleteVehicle(vehicleId: string) {
  try {
    const response = await fetch(`${serverUrl}/vehicles/${vehicleId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete vehicle")
    }

    return true
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    throw error
  }
}


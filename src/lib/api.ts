export async function getUserJobs(userId: string) {
  try {
    const res = await fetch(`http://localhost:8080/jobs/${userId}`, {
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

export async function createJob(jobData: any) {
  try {
    const response = await fetch("http://localhost:8080/jobs", {
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

export async function updateJob(jobId: number, jobData: any) {
  try {
    const response = await fetch(`http://localhost:8080/jobs/${jobId}`, {
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
    const res = await fetch(`http://localhost:8080/jobs/${jobId}`, {
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

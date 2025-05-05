export async function getUserJobs(userId: string) {
    try {
      const res = await fetch(`http://localhost:8080/jobs/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.statusText}`);
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return null;
    }
  }
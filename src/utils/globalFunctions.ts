export const validateOtp = (
  otp: string,
  createdAt: Date,
  expiretime: Date,
  candidateOtp: string,
): boolean => {
  const now = new Date();
  return otp !== candidateOtp || now < createdAt || now > expiretime;
};

export const generateOtp = async (otplen: number): Promise<string> => {
  while (true) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (otplen == otp.length) {
      return otp;
    }
  }
};

export const formatHelperMainSkills = (data: any) => {
  const uniqueJobIds = new Set();

  const uniqueJobs = data?.reduce((acc: any[], item: any) => {
    const isUnique = !uniqueJobIds.has(item.main_job_id._id.toString());

    if (isUnique) {
      uniqueJobIds.add(item.main_job_id._id.toString());
      acc.push(item.main_job_id);
    }

    return acc;
  }, []);

  return uniqueJobs;
};

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const dateFormatter = (expiry_time: Date) => {
  const expiryDate = new Date(expiry_time);
  const formattedExpiry = expiryDate.toLocaleString('en-US', {
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return formattedExpiry;
};

export const generateOrderNumber = () => {
  return '100' + Math.floor(10000 + Math.random() * 90000).toString();
};

export const getAvgRatingAndTotalRating = (ratedJobs: any) => {
  const totalNoOfRatedJobs = ratedJobs?.length;
  const avgRating =
    ratedJobs?.reduce((acc: any, curr: any) => acc + curr.total_rating, 0) /
    totalNoOfRatedJobs;

  return { totalNoOfRatedJobs, avgRating };
};

export const getCustomerAvgRatingAndTotalRating = (ratedJobs: any) => {
  const totalNoOfRatedJobs = ratedJobs?.length;
  const avgRating =
    ratedJobs?.reduce((acc, curr) => acc + curr?.customer_rating, 0) /
    totalNoOfRatedJobs;

  return { totalNoOfRatedJobs, avgRating };
};

//dummy function
export const getRandomHelperJobs = (dummyData) => {
  const selectedHelpers = dummyData
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
  const result = selectedHelpers.map((jobs) => {
    if (jobs.length <= 2) return jobs;

    const takeAll = Math.random() > 0.5;
    return takeAll ? jobs : jobs.sort(() => 0.5 - Math.random()).slice(0, 2);
  });

  return result;
};

export const getRandomJobs = (dummyJobs = [], count = 1) => {
  const shuffled = [...dummyJobs].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

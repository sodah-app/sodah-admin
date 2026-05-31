// CHECK USER SUBSCRIPTION STATUS
export function checkSubscription(
  user
) {
  // NO USER
  if (!user) {
    return {
      expired: false,

      remainingDays: 0,

      remainingHours: 0,

      notification: "",
    };
  }

  // NO TRIAL DATE
  if (!user.trialEndDate) {
    return {
      expired: false,

      remainingDays: 0,

      remainingHours: 0,

      notification: "",
    };
  }

  // DATES
  const now = new Date();

  const endDate = new Date(
    user.trialEndDate
  );

  // TIME LEFT
  const remainingMs =
    endDate - now;

  // DAYS
  const remainingDays =
    Math.ceil(
      remainingMs /
        (1000 *
          60 *
          60 *
          24)
    );

  // HOURS
  const remainingHours =
    Math.ceil(
      remainingMs /
        (1000 *
          60 *
          60)
    );

  // EXPIRED
  if (remainingMs <= 0) {
    return {
      expired: true,

      remainingDays: 0,

      remainingHours: 0,

      notification:
        "Your subscription has expired.",
    };
  }

  // 3 HOURS WARNING
  if (remainingHours <= 3) {
    return {
      expired: false,

      remainingDays,

      remainingHours,

      notification:
        "Your trial expires in 3 hours.",
    };
  }

  // 2 DAYS WARNING
  if (remainingDays <= 2) {
    return {
      expired: false,

      remainingDays,

      remainingHours,

      notification: `Your free trial expires in ${remainingDays} day(s).`,
    };
  }

  // ACTIVE
  return {
    expired: false,

    remainingDays,

    remainingHours,

    notification: "",
  };
}
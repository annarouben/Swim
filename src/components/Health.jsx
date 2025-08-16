import { HeartIcon, ShieldCheckIcon, BoltIcon, CheckCircleIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

function Health() {
  // Mock data - in real app this would come from watch/API
  const healthData = {
    restingHeartRate: {
      current: 62,
      trend: 'down',
      change: 3,
      rating: 'excellent'
    },
    exerciseHeartRate: {
      average: 145,
      targetMin: 135,
      targetMax: 155,
      rating: 'perfect'
    },
    recovery: {
      timeToNormal: '2:15',
      rating: 'good'
    },
    fitnessScore: {
      vo2Max: 42,
      rating: 'above average',
      ageGroup: 'your age group'
    },
    readiness: {
      score: 85,
      sleepHours: 7.2,
      hrvScore: 35,
      statusColor: 'green'
    }
  };

  return (
    <div className="space-y-4">
      {/* Resting Heart Rate Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <HeartIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.restingHeartRate.current} bpm</span>
              Resting Heart Rate
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Excellent (Athletes: 40-60, Good: 60-70)
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                Down {healthData.restingHeartRate.change} bpm from last month - great progress!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Heart Rate Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <BoltIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.exerciseHeartRate.average} bpm</span>
              Swimming Heart Rate
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Perfect training zone (Your target: {healthData.exerciseHeartRate.targetMin}-{healthData.exerciseHeartRate.targetMax})
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                You're working hard but not overdoing it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <ShieldCheckIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.recovery.timeToNormal}</span>
              Heart Recovery
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Good fitness (Under 2 min = excellent, 2-3 min = good)
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                Your heart bounces back well after exercise
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Score Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <BoltIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.fitnessScore.vo2Max}</span>
              Fitness Score
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Above Average for {healthData.fitnessScore.ageGroup}
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                Your body uses oxygen efficiently during exercise
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Readiness Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <ShieldCheckIcon className="w-10 h-10 text-slate-200" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.readiness.score}%</span>
              Today's Readiness
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Last night: {healthData.readiness.sleepHours} hrs → Ready for workout
              </p>
              <p className="text-xs text-slate-300 leading-normal text-left">
                Your best workouts happen after 7+ hours sleep
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Health;

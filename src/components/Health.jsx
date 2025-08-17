import { ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

function Health() {
  // Mock data - in real app this would come from watch/API
  const healthData = {
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
    readiness: {
      score: 85,
      sleepHours: 7.2,
      hrvScore: 35,
      statusColor: 'green'
    }
  };

  return (
    <div className="space-y-4">
      {/* Exercise Heart Rate Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <div 
                  className="w-10 h-10 text-slate-200"
                  style={{
                    WebkitMask: `url(./images/gpt-swimheart.svg) no-repeat center / contain`,
                    mask: `url(./images/gpt-swimheart.svg) no-repeat center / contain`,
                    backgroundColor: 'currentColor'
                  }}
                />
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
                <div 
                  className="w-12 h-12 text-slate-200 flex items-center justify-center"
                  style={{
                    WebkitMask: `url(./images/gpt-heart.svg) no-repeat center / contain`,
                    mask: `url(./images/gpt-heart.svg) no-repeat center / contain`,
                    backgroundColor: 'currentColor'
                  }}
                />
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

      {/* Sleep Card */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex gap-4">
          {/* Left Column - Icon */}
          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                <div 
                  className="w-8 h-8 text-slate-200"
                  style={{
                    WebkitMask: `url(./images/noun-moon-5866801.svg) no-repeat center / contain`,
                    mask: `url(./images/noun-moon-5866801.svg) no-repeat center / contain`,
                    backgroundColor: 'currentColor'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-slate-200 mb-2 text-left">
              <span className="text-[#A8F5E0] font-bold text-base mr-2">{healthData.readiness.sleepHours} hrs</span>
              Sleep
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 leading-normal text-left">
                Last night sleep → Ready for workout ({healthData.readiness.score}%)
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

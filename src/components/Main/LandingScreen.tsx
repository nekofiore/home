import './animations.scss'

export default function LandingScreen () {
  return (
    <>
      <div className="bg-wheat min-h-screen w-full flex items-center justify-center fixed -z-10">
        <div
          className=""
          style={{
            animation: 'shift-left 1s ease forwards',
            animationDelay: '700ms'
          }}
        >
          <div
            className="w-120 h-120 bg-white flex items-center justify-center relative"
            style={{
              animation: 'spin-in 0.75s ease forwards',
            }}
          >
            <div
              className="w-115 h-115 border-8 border-wheat flex items-center justify-center opacity-0"
              style={{
                animation: 'border-fade-in 0.75s ease forwards',
                animationDelay: '750ms'
              }}
            >
              <div
                className="flex flex-col items-center justify-center h-full opacity-0 gap-2.5 -rotate-135"
                style={{
                  animation: 'intro-fade-in 1.25s ease forwards',
                  animationDelay: '750ms'
                }}
              >
                <h1 className="text-4xl">
                  tensofu
                </h1>
                <hr />
                <p>home page of a failed artist and developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

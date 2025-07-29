const Infobar = () => {
    const features= [
        {
            title: "AI-Based Predictions",
            desc: "Get accurate crop yield predictions using cutting-edge machine learning models.",
            icon: "🌾",
        },
        {
            title: "SHAP Visualizations",
            desc: "Interpret model decisions with feature attribution and SHAP graphs.",
            icon: "📊",
        },
        {
            title: "Leaderboard",
            desc: "Track and compare performance of models and improvements over time.",
            icon: "🏆",
        },
        {
            title: "Farmer Insights",
            desc: "View insights customized for individual farmers or regions.",
            icon: "🧑‍🌾",
        },
    ] as {
        title: string;
        desc: string;
        icon: string;
    }[];
    return (    
        <section className="relative w-full mt-20 z-10">
        <div className="w-[90%] max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Powerful Features for Smart Farming
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
                <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-white transition-transform duration-300 transform hover:scale-[1.04]"
                >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-100 leading-relaxed">{f.desc}</p>
                </div>
            ))}
            </div>
        </div>
        </section>

    )
}

export default Infobar
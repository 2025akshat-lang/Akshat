<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animated Rotating Border Hub</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #0d1117;
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        /* Outer Main Card with Rotating Border */
        .card {
            width: 100%;
            max-width: 420px;
            background: #07182E;
            position: relative;
            display: flex;
            flex-direction: column;
            place-content: center;
            place-items: center;
            overflow: hidden;
            border-radius: 35px; /* Border Radius Badha Diya */
            padding: 40px 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* Outer Card Content Container */
        .card-content {
            z-index: 2;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .card h2 {
            color: white;
            font-size: 1.4em;
            margin-bottom: 10px;
            text-align: center;
            letter-spacing: 1px;
        }

        /* Card ki Rotating Gradient Strip */
        .card::before {
            content: '';
            position: absolute;
            width: 160%;
            height: 160%;
            background-image: linear-gradient(180deg, #00b7ff, #ff30ff);
            animation: rotBGimg 4s linear infinite;
        }

        /* Card Inner Overlay */
        .card::after {
            content: '';
            position: absolute;
            background: #07182E;
            inset: 4px; /* Card border thickness */
            border-radius: 31px; /* Inner smooth radius */
            z-index: 1;
        }

        /* Animated Rotating Buttons */
        .glow-btn {
            position: relative;
            width: 90%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            overflow: hidden;
            border-radius: 50px; /* Fully rounded Pill shape */
            transition: transform 0.2s ease;
        }

        .glow-btn:hover {
            transform: scale(1.03);
        }

        /* Button Rotating Border Strip */
        .glow-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 300%;
            background-image: linear-gradient(180deg, #00ffcc, #00b7ff);
            animation: rotBGimg 3s linear infinite;
        }

        /* Button Inner Text Area (Grey Background) */
        .glow-btn span {
            position: relative;
            z-index: 2;
            width: calc(100% - 4px); /* Button Border thickness (2px around) */
            height: calc(100% - 4px);
            background: #f0f4f9;
            color: #1f2937;
            border-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
        }

        /* Continuous Rotation Animation */
        @keyframes rotBGimg {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>

    <!-- Main Card -->
    <div class="card">
        <div class="card-content">
            <h2>📁 Practical Database</h2>

            <!-- Animated Buttons -->
            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/Distillation%20setup.html" class="glow-btn">
                <span>Distillation Setup</span>
            </a>

            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/Mindmapsolution.html" class="glow-btn">
                <span>Mindmap Solution</span>
            </a>

            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/Evaporation%20Vs%20boiling.html" class="glow-btn">
                <span>Evaporation Vs Boiling</span>
            </a>

            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/crystallization.html" class="glow-btn">
                <span>Crystallization Experiment</span>
            </a>

            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/vaccum%20evaporation.html" class="glow-btn">
                <span>Vacuum Evaporation</span>
            </a>

            <a href="https://2025akshat-lang.github.io/Metro-Runner-India/index.html" class="glow-btn">
                <span>Metro Runner 2D Game</span>
            </a>
        </div>
    </div>

</body>
</html>

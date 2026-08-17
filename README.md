<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chemistry Practicals Database</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #0d1117; color: #fff; margin: 0; padding: 20px 10px; display: flex; justify-content: center; }
    
    .container { width: 100%; max-width: 450px; }

    /* Collapsible Folder Style */
    details {
      background: #161b22;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      border: 1px solid #30363d;
    }

    summary {
      background-color: #1a73e8;
      color: white;
      font-weight: bold;
      font-size: 16px;
      padding: 16px 20px;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      border-radius: 12px;
    }

    /* Toggle '+' and '-' icon */
    summary::-webkit-details-marker { display: none; }
    summary::after { content: "+"; font-size: 22px; font-weight: 300; }
    details[open] summary::after { content: "—"; font-size: 18px; }
    details[open] summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

    /* Topic Buttons Container */
    .content-box {
      background-color: #ffffff;
      padding: 25px 15px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    /* Rounded Pill Buttons Style */
    .pill-btn {
      display: inline-block;
      background-color: #f1f5f9;
      color: #334155;
      padding: 10px 18px;
      border-radius: 20px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 2px 5px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      text-align: center;
    }

    .pill-btn:hover {
      background-color: #1a73e8;
      color: #ffffff;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>

  <div class="container">
    <details open>
      <summary>
        <span>📁 Chemistry Practicals Database</span>
      </summary>
      
      <div class="content-box">
        <a href="Distillation%20setup.html" class="pill-btn">Distillation Setup</a>
        <a href="Mindmapsolution.html" class="pill-btn">Mindmap Solution</a>
        <a href="Evaporation%20Vs%20boiling.html" class="pill-btn">Evaporation Vs Boiling</a>
        <a href="crystallization.html" class="pill-btn">Crystallization</a>
        <a href="vaccum%20evaporation.html" class="pill-btn">Vacuum Evaporation</a>
        <a href="https://2025akshat-lang.github.io/Metro-Runner-India/" class="pill-btn">Metro Runner Game</a>
      </div>
    </details>
  </div>

</body>
</html>

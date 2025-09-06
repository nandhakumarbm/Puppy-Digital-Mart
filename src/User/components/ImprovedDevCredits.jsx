import { Mail, Phone, Code, Users } from "lucide-react";

export default function ImprovedDevCredits({ redemptions = [1] }) {
  if (!redemptions.length) return null;

  const devs = [
    {
      name: "Nandhakumar B M",
      email: "nandhakumarbm7@gmail.com",
    },
    {
      name: "Akash MG",
      email: "akdev2176@gmail.com",
    },
  ];

  return (
    <>
      <style>
        {`
          .credits-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 24px;
            margin-top: 24px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
          }
          .credits-bg {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(30px, -30px);
          }
          .credits-header-line {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }
          .credits-icon {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            padding: 10px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .credits-header {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .credits-header-text {
            font-size: 18px;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .dev-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .dev-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            width: 100%;
          }
          .dev-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }
          .dev-name {
            font-size: 16px;
            font-weight: 600;
            color: white;
            margin-bottom: 8px;
          }
          .contact-link {
            color: #E3F2FD;
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
            word-break: break-all;
          }
          .contact-link:hover {
            color: white;
          }
          .credits-footer {
            margin-top: 20px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-style: italic;
          }

          @media (max-width: 768px) {
            .credits-container {
              padding: 20px;
            }
            .credits-header-text {
              font-size: 16px;
            }
          }

          @media (max-width: 480px) {
            .credits-container {
              padding: 16px;
            }
            .credits-header-text {
              font-size: 14px;
            }
            .contact-link {
              font-size: 12px;
            }
          }
        `}
      </style>

      <div className="credits-container">
        <div className="credits-bg" />

        {/* ICON + HEADER INLINE */}
        <div className="credits-header-line">
          <div className="credits-icon">
            <Code size={24} color="white" />
          </div>
          <div className="credits-header-text">Developed By</div>
        </div>

        {/* FULL-WIDTH DEV CARDS */}
        <div className="dev-grid">
          {devs.map((dev, i) => (
            <div key={i} className="dev-card">
              <div className="dev-name">{dev.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <a href={`mailto:${dev.email}`} className="contact-link">
                  <Mail size={14} /> {dev.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="credits-footer">Let's build your dream together!😉</div>
      </div>
    </>
  );
}

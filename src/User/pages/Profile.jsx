import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import PhoneIcon from "@mui/icons-material/Phone";

export default function ProfileCard() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                bottom: "20px",
                p: 2,
            }}
        >
            <Card
                sx={{
                    width: 320,
                    p: 3,
                    borderRadius: "20px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    background: "linear-gradient(90deg, #8e2de2, #4a00e0)",
                    color: "#fff",
                    textAlign: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.03)",
                    },
                }}
            >
                <Avatar
                    sx={{
                        width: 90,
                        height: 90,
                        margin: "0 auto",
                        bgcolor: "#F06292",
                        fontSize: 36,
                        fontWeight: "bold",
                        fontFamily: "Poppins"
                    }}
                >
                    N
                </Avatar>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mt={2}
                    sx={{ color: "#ffff", fontFamily: "Poppins" }}
                >
                    Nandhakumar
                </Typography>

                <CardContent sx={{ mt: 2 }}>
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneIcon style={{ color: "#ffff" }} fontSize="small" color="action" />
                            <Typography style={{ fontFamily: "Poppins" }} variant="body2">+91 98765 43210</Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}  
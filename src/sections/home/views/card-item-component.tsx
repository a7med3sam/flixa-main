import { primary } from "src/theme/palette";
import { Box, Card, Avatar, Typography, CardContent } from "@mui/material";

type CardItemProps = {
  value: number;
  label: string;
  icon: React.ReactNode;
};
const CardItem = ({ value, label, icon }: CardItemProps) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 174,
          px: 2,
        }}
      >
        {/* Center - Value and Label */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              width: '45px',
              height: '59px',
              fontFamily: 'DIN Next LT Arabic',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '59px',
              textAlign: 'right',
              color: '#263238',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            {value} 
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: '45px',
              height: '24px',
              fontFamily: 'DIN Next LT Arabic',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'right',
              color: '#263238',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              maxWidth: '45px',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
        </Box>

        {/* Right - icon avatar */}
        <Avatar
          sx={{
            bgcolor: '#d8ebd7',
            color: primary.main,
            width: 56,
            height: 56,
            fontSize: 32,
          }}
        >
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default CardItem;
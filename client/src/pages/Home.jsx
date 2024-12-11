import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { HomePageText, STANDARD_CC_FEATURES, PRO_CC_FEATURES } from '../constants/Constants';
import { useAuthContext } from '../hooks/useAuthContext';
import ProductFeatures from '../components/ProductFeatures';

const Home = () => {
  const { user, isSubscribed } = useAuthContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      {/* Welcome Section */}
      <Card sx={{ width: '80%', maxWidth: 700, bgcolor: 'lightgray', borderRadius: 2, padding: 3, textAlign: 'center', mb: 10 }}>
        <Typography variant="h4" gutterBottom>
          {HomePageText.welcomeMessage}
        </Typography>
        <Typography variant="body1" paragraph>
          {HomePageText.description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button component={Link} to="/create" variant="contained" color="success" size="small">
            {HomePageText.createProposalLink}
          </Button>
          <Button component={Link} to="/example" variant="contained" color="primary" size="medium">
            {HomePageText.exampleProposalLink}
          </Button>
        </Box>
      </Card>

      {/* Features Section */}
      <Box
        sx={{
          width: '100%', // Full width
          mb: 10,
          display: 'flex',
          justifyContent: 'center', // Centers content horizontally
          textAlign: 'center', // Ensures text is centered within the Box
        }}
      >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {[
          { title: 'Streamlined Decision-Making', description: 'Consensus Check simplifies the process of gathering input from your team, making it easier to reach decisions quickly and efficiently.' },
          { title: 'Asynchronous Collaboration', description: 'Team members can contribute their thoughts and opinions at their convenience, eliminating the need for scheduling conflicts and allowing for more flexible participation.' },
          { title: 'Centralized Input', description: 'Say goodbye to scattered email chains and text messages. Consensus Check keeps all team input in one place, making it easy to track and reference.' },
          { title: 'Time-Saving', description: 'Reduce the need for lengthy meetings by gathering initial feedback and identifying areas of consensus beforehand.' },
        ].map((feature, index) => (
          <Grid size={6} key={index}> {/* Adjusted for responsive grid items */}
            <Typography variant="h6" gutterBottom>
              {feature.title}
            </Typography>
            <Typography variant="body2">
              {feature.description}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>


      {/* Teams Section */}
      <Box 
        sx={{
          width: '50%', // Full width
          mb: 10,
          justifyContent: 'start', // Centers content start
          textAlign: 'start', // Ensures text is centered within the Box
        }}
      >
        <Typography variant="h5" gutterBottom>
          Perfect for Various Teams
        </Typography>
        <Typography variant="body1" paragraph>
          Consensus Check is ideal for:
        </Typography>
        <Box component="ul" sx={{ listStyleType: 'disc', paddingLeft: 4, textAlign: 'left', display: 'inline-block' }}>
          {['Nonprofit organizations', 'Business teams', 'Community groups', 'Cooperatives', 'Any group that needs to make collective decisions'].map((item, index) => (
            <Typography component="li" key={index} variant="body2">
              {item}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          By using Consensus Check, you’ll empower your team to contribute their thoughts without the constraints of scheduling, ensure thorough consideration of all viewpoints, and make more informed decisions. It’s great for teams that value efficiency, inclusivity, and clear communication in their decision-making process.
        </Typography>
      </Box>

      {/* Pricing Section */}
      <Typography variant="h5" gutterBottom>
        PRICING
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
        {[
          { title: 'BASIC', price: 'FREE', features: STANDARD_CC_FEATURES },
          { title: 'SUPPORTER', price: 'Pay What You Can', features: PRO_CC_FEATURES },
        ].map((plan, index) => (
          <Card key={index} sx={{ width: 300, padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {plan.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {plan.price}
            </Typography>
            {plan.features.map((feature, i) => (
              <Typography key={i} variant="body2">
                {feature}
              </Typography>
            ))}
            {index === 0 && user ? (
              <Button variant="contained" color="success">
                <FontAwesomeIcon icon={faCheckCircle} />
              </Button>
            ) : index === 1 && !user ? (
              <Button component={Link} to="/auth" variant="contained" color="primary">
                Become A Supporter
              </Button>
            ) : index === 1 && isSubscribed ? (
              <Button variant="contained" color="success">
                <FontAwesomeIcon icon={faCheckCircle} />
              </Button>
            ) : (
              <Button component={Link} to="/subscribe" variant="contained" size="small">
                Become A Supporter
              </Button>
            )}
          </Card>
        ))}
      </Box>

      <ProductFeatures />

      {/* Basics Section */}
      <Card sx={{ width: '80%', maxWidth: 700, bgcolor: '#f9f9f9', borderRadius: 2, padding: 3, textAlign: 'center', boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          BASICS
        </Typography>
        <Typography variant="body1" paragraph>
          {HomePageText.basicsSection.description}
        </Typography>
        <Button component={Link} to="/basics" variant="contained" color="primary">
          {HomePageText.learnMoreLink}
        </Button>
      </Card>
    </Box>
  );
};

export default Home;

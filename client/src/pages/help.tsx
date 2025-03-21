import RootLayout from "@/components/layouts/RootLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, Search, Briefcase, FileText, User2, Bell, Shield } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function HelpPage() {
  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
            >
              <HelpCircle className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of SahyogJeevan platform.
            </p>
          </div>

          <Card className="backdrop-blur-sm border-primary/10 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about using our platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <Search className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>How do I search for jobs?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>You can search for jobs on the home page using the search bar. Enter keywords related to the job title or location you're interested in. You can also filter jobs by category and type (full-time jobs or part-time gigs).</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>How do I apply for a job?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>To apply for a job, click on the job card to view details, then click the "Apply Now" button. You'll need to fill out the application form with your information. Make sure your profile is complete before applying to increase your chances of getting hired.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>How do I post a job as an employer?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>As an employer, you can post a job by clicking on the "Post Job" button in the navigation bar. Fill out the job details form, including title, description, location, salary, and requirements. Once submitted, your job will be visible to potential applicants.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <User2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>How do I update my profile?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>To update your profile, click on the "Profile" link in the navigation bar. You can edit your personal information, skills, experience, and contact details. A complete profile helps employers learn more about you and increases your chances of getting hired.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <Bell className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>How do I track my job applications?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>You can track your job applications by clicking on the "Applied Jobs" link in the navigation bar. This page shows all the jobs you've applied for, along with their current status. You'll also receive notifications when there are updates to your applications.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="flex items-center gap-2 text-left">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>What's the difference between jobs and gigs?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>On our platform, "Jobs" typically refer to full-time employment opportunities with regular hours and benefits. "Gigs" are part-time or temporary work opportunities that may be more flexible but might not include benefits. You can filter between these types on the home page.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm border-primary/10 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Contact Support</CardTitle>
              <CardDescription>Need more help? Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p className="text-muted-foreground">For additional support, please contact us at:</p>
                <p className="font-medium">support@sahyogjeevan.com</p>
                <p className="font-medium">+91 123-456-7890</p>
              </div>
              <p className="text-sm text-muted-foreground">Our support team is available Monday to Friday, 9:00 AM to 6:00 PM IST.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RootLayout>
  );
}

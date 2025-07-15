import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';

const Resources = () => {
  const sections = [
    {
      title: "Official Government and Oversight Resources",
      resources: [
        {
          name: "City of New Orleans – NOPD Transparency & Data",
          description: "The city's official portal provides public access to a wide range of New Orleans Police Department data and records. This includes an interactive crime map (via ExploreNOLA), weekly crime stats, open datasets (e.g. calls for service, electronic police reports, use-of-force incidents, etc.), and performance dashboards.",
          links: [
            { url: "https://nola.gov", label: "nola.gov" },
            { url: "https://nopdnews.com", label: "nopdnews.com" }
          ]
        },
        {
          name: "Office of the Independent Police Monitor (OIPM)",
          description: "An official but independent city agency that provides civilian oversight of the NOPD. Established in 2009 by city charter, OIPM monitors police misconduct investigations, reviews uses of force, and issues public reports and recommendations to improve accountability.",
          links: [
            { url: "https://nolaipm.gov", label: "nolaipm.gov" }
          ]
        },
        {
          name: "New Orleans Police Consent Decree Monitor",
          description: "A court-appointed monitoring team overseeing NOPD's compliance with a federal consent decree entered in 2012. The monitor's role is to assess and report whether NOPD is implementing the extensive reforms required by the U.S. Department of Justice and achieving constitutional, professional policing.",
          links: [
            { url: "https://nola.gov", label: "nola.gov" }
          ]
        }
      ]
    },
    {
      title: "Crime Data and Public Dashboards",
      resources: [
        {
          name: "City of New Orleans Open Data Portal",
          description: "The city's open data platform offers downloadable datasets on crime and policing in New Orleans. Available data include reported incidents (calls for service), electronic police reports with details on offenses and demographics, stop-and-search (field interview) records, use-of-force reports, and misconduct complaint logs.",
          links: [
            { url: "https://data.nola.gov", label: "data.nola.gov" },
            { url: "https://nopdnews.com", label: "nopdnews.com" }
          ]
        },
        {
          name: "New Orleans City Council Public Safety Dashboards",
          description: "A collection of interactive dashboards maintained by the City Council that visualize key public safety and justice metrics. These online tools display up-to-date statistics on major crimes, arrests, 911 calls, and the jail population, as well as police performance indicators.",
          links: [
            { url: "https://council.nola.gov", label: "council.nola.gov" }
          ]
        },
        {
          name: "Police Scorecard – New Orleans",
          description: "An independent data project (by the nonprofit Campaign Zero) that evaluates police departments nationwide on metrics of police violence, accountability, and funding. The New Orleans Police Department's scorecard compiles data on use of force, civilian complaints, shootings, arrests, and racial disparities, benchmarking NOPD against state and national standards.",
          links: [
            { url: "https://policescorecard.org", label: "policescorecard.org" }
          ]
        }
      ]
    },
    {
      title: "Watchdog and Advocacy Organizations",
      resources: [
        {
          name: "Metropolitan Crime Commission (MCC)",
          description: "A New Orleans-based nonprofit organization founded in 1952 that acts as a watchdog over local criminal justice. The MCC investigates public corruption and monitors the performance of agencies like the NOPD, serving as a conduit for citizens to report wrongdoing.",
          links: [
            { url: "https://metrocrime.org", label: "metrocrime.org" },
            { url: "https://www.causeiq.com/organizations/metropolitan-crime-commission,726009984/", label: "causeiq.com" }
          ]
        },
        {
          name: "ACLU of Louisiana – Justice Lab",
          description: "The state chapter of the American Civil Liberties Union is active in holding police accountable through advocacy and litigation. Its Justice Lab: Putting Racist Policing on Trial initiative documents instances of police misconduct and racial bias across Louisiana, including New Orleans.",
          links: [
            { url: "https://www.laaclu.org", label: "laaclu.org" }
          ]
        }
      ]
    },
    {
      title: "Investigative News and Media Archives",
      resources: [
        {
          name: "The Times-Picayune | NOLA.com",
          description: "New Orleans' major daily newspaper (now part of The Advocate) has extensive coverage of crime and police issues. NOLA.com reports breaking crime news and has produced in-depth investigations into NOPD misconduct and accountability.",
          links: [
            { url: "https://www.nola.com", label: "nola.com" },
            { url: "https://www.pbs.org/wgbh/frontline/documentary/law-disorder/", label: "PBS Frontline: Law & Disorder" }
          ]
        },
        {
          name: "The Lens",
          description: "A nonprofit investigative journalism outlet dedicated to in-depth New Orleans news. The Lens regularly covers criminal justice and NOPD accountability – from analyses of police budgets and misconduct records to watchdog reporting on reforms.",
          links: [
            { url: "https://thelensnola.org", label: "thelensnola.org" }
          ]
        },
        {
          name: "Verité News",
          description: "A Black-led nonprofit news organization launched in 2022 to produce impactful, community-centered journalism in New Orleans. Verité focuses on stories affecting marginalized communities and has published investigations into policing practices and public safety disparities.",
          links: [
            { url: "https://veritenews.org", label: "veritenews.org" }
          ]
        },
        {
          name: "WWNO 89.9 FM (New Orleans Public Radio)",
          description: "The local NPR affiliate provides substantive reporting on criminal justice and police accountability in the region. WWNO's newsroom and partner podcasts have examined issues such as NOPD's consent decree progress, homicide clearance rates, and allegations of bias in policing.",
          links: [
            { url: "https://www.wwno.org", label: "wwno.org" }
          ]
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            New Orleans Crime and Police Accountability Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-4xl">
            A comprehensive collection of official government resources, oversight organizations, 
            data platforms, and investigative journalism outlets dedicated to transparency and 
            accountability in New Orleans policing and criminal justice.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {section.title}
              </h2>
              
              <div className="grid gap-6">
                {section.resources.map((resource, resourceIndex) => (
                  <Card key={resourceIndex} className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">
                        {resource.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4 leading-relaxed">
                        {resource.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-3">
                        {resource.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {sectionIndex < sections.length - 1 && (
                <Separator className="mt-8" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Each of these resources is publicly accessible and regularly updated. 
            They offer a broad toolset for anyone researching police misconduct, crime trends, and reform 
            efforts in New Orleans – from official data and oversight reports to independent analyses and 
            investigative journalism.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
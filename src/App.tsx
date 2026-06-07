﻿import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import './index.css'

type JobType = 'Fritidsjob' | 'Praktik' | 'Læreplads' | 'Sommerjob'

type Job = {
  id: number
  companyId: number
  status: 'Aktiv'
  postedAgo: string
  applicantsCount: number
  tags: string[]
  verified: boolean
  payLabel?: string
  companyLogo?: string
  jobImage?: string
  title: string
  company: string
  companyProfile: string
  location: string
  type: JobType
  age: string
  hours: string
  salary: string
  deadline: string
  posted: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  applicationDeadline: string
  description: string
  body: string[]
  tasks: string[]
  requirements: string[]
  benefits?: string[]
  applicationText?: string
  application: string
}

type Company = {
  id: number
  name: string
  logoUrl?: string
  coverImageUrl?: string
  description: string
  website?: string
  contactEmail: string
  contactPhone: string
}

type ApplicationStatus = 'Ansøgning sendt' | 'Svar modtaget'

type Application = {
  id: number
  job_id: number
  company_id: number
  applicant_profile_id: number
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  applicant_age: string
  applicant_city: string
  applicant_education: string
  message: string
  company_reply_message?: string
  cv_file_url: string
  cv_file_name: string
  profile_image_url: string
  status: ApplicationStatus
  created_at: string
}

type ApplicationFormState = {
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAge: string
  applicantCity: string
  applicantEducation: string
  message: string
  cvFile: File | null
  cvFileName: string
  cvFileUrl: string
  profileImageUrl: string
  gdprConsent: boolean
}

type FormState = {
  company: string
  contactName: string
  email: string
  phone: string
  title: string
  type: JobType
  location: string
  age: string
  hours: string
  description: string
  companyLogoFileName: string
  companyLogoUrl: string
  jobImageFileName: string
  jobImageUrl: string
}

type Language = 'da' | 'en'
type AppView = 'home' | 'company-dashboard' | 'jobseeker-dashboard'
type UserRole = 'guest' | 'jobseeker' | 'company'
type SignupStep = 'select' | 'jobseeker' | 'company'
type CompanyApplicationStatus = ApplicationStatus
type JobSeekerApplicationStatus = ApplicationStatus

type JobSeekerSignupState = {
  firstName: string
  lastName: string
  email: string
  password: string
  age: string
  city: string
  phone: string
  bio: string
  cvFileName: string
  cvFileUrl: string
}

type CompanySignupState = {
  companyName: string
  cvr: string
  industry: string
  website: string
  contactPerson: string
  contactRole: string
  email: string
  password: string
  phone: string
  address: string
  description: string
  logoFileName: string
  logoUrl: string
}

type CompanyJob = {
  id: number
  title: string
  type: JobType
  location: string
  status: 'Aktiv' | 'Lukket' | 'Kladde'
  applicantsCount: number
  postedDate: string
}

type ApplicantProfile = {
  id: number
  name: string
  age: string
  city: string
  education: string
  email: string
  phone: string
  appliedJob: string
  applicationDate: string
  status: CompanyApplicationStatus
  cvUrl: string
}

type NotificationItem = {
  id: number
  title: string
  text: string
  time: string
}

const copy = {
  da: {
    tagline: 'Job • Praktik • Læreplads',
    jobSeekers: 'Jobsøgende',
    forCompanies: 'For virksomheder',
    login: 'Log ind',
    signup: 'Opret profil',
    createCompany: 'Opret virksomhedsprofil',
    createListing: 'Opret opslag',
    createShort: 'Opret',
    pilot: 'Pilotområde: Nakskov',
    heroTitle: 'Find job, praktik og lærepladser i Nakskov.',
    heroText:
      'En enkel platform der forbinder unge og lokale virksomheder i Nakskov.',
    seeListings: 'Se muligheder',
    createAsCompany: 'Opret virksomhedsprofil',
    youngTitle: 'For unge',
    youngText: 'Søg efter jobtype og alder. Se hurtigt om jobbet passer til dig.',
    companyTitle: 'For virksomheder',
    companyText: 'Opret et opslag med kontaktperson, krav og arbejdsopgaver.',
    localTitle: 'Lokal fokus',
    localText: 'Platformen starter i Nakskov, så unge og virksomheder får et enkelt lokalt sted at mødes.',
    overview: 'Joboversigt',
    currentListings: 'Aktuelle muligheder',
    listingsFound: 'opslag fundet',
    search: 'Søg',
    searchPlaceholder: 'Søg efter job eller virksomhed',
    type: 'Type',
    all: 'Alle',
    noMatchesTitle: 'Ingen opslag fundet',
    noMatchesText: 'Prøv en anden type eller søgning.',
    age: 'Alder',
    time: 'Tid',
    salary: 'Løn',
    deadline: 'Frist',
    tasks: 'Opgaver',
    requirements: 'Det forventes',
    aboutCompany: 'Om virksomheden',
    howToApply: 'Sådan søger du',
    readListing: 'Læs opslag',
    readMore: 'Læs mere',
    showLess: 'Vis mindre',
    aboutJob: 'Om jobbet',
    jobFacts: 'Job fakta',
    posted: 'Dato',
    contactPersonLabel: 'Kontaktperson',
    email: 'E-mail',
    phoneLabel: 'Telefon',
    applicationDeadlineLabel: 'Ansøgningsfrist',
    sendEmail: 'Send e-mail',
    callPhone: 'Ring op',
    contactCompany: 'Kontakt virksomheden',
    companySectionTitle: 'Opret et seriøst opslag på få minutter.',
    companySectionText:
      'Opret lokale jobopslag med tydelig kontakt, krav og arbejdsopgaver, så unge hurtigt kan vurdere om jobbet passer.',
    checkContact: 'Kontaktoplysninger samles ét sted',
    checkDetails: 'Opslaget får jobtype, alder, sted og arbejdstid',
    checkDatabase: 'Ansøgninger modtages i virksomhedens dashboard',
    formIntro: 'Felter markeret med indhold skal udfyldes, før opslaget kan sendes.',
    formError: 'Tjek at alle felter er udfyldt, og at e-mailen er gyldig.',
    formSuccess: 'Opslaget er oprettet og vises nu på platformen.',
    company: 'Virksomhed',
    contactPerson: 'Kontaktperson',
    phone: 'Telefon',
    title: 'Titel på opslag',
    city: 'By',
    agePlaceholder: 'Fx 15+ år',
    hours: 'Arbejdstid',
    hoursPlaceholder: 'Fx 6-10 timer om ugen',
    description: 'Kort beskrivelse',
    descriptionPlaceholder: 'Beskriv opgaver, forventninger og hvordan den unge søger.',
    sendListing: 'Send opslag',
    footerText: 'Pilotplatform for unge, virksomheder og lokale muligheder.',
  },
  en: {
    tagline: 'Job • Internship • Apprenticeship',
    jobSeekers: 'Job seekers',
    forCompanies: 'For companies',
    login: 'Log in',
    signup: 'Create profile',
    createCompany: 'Create company',
    createListing: 'Create listing',
    createShort: 'Create',
    pilot: 'Pilot area: Nakskov',
    heroTitle: 'Find jobs, internships and apprenticeships in Nakskov.',
    heroText:
      'A simple platform connecting young people and local companies in Nakskov.',
    seeListings: 'See opportunities',
    createAsCompany: 'Create company profile',
    youngTitle: 'For young people',
    youngText: 'Search by job type and age. Quickly see if the listing fits you.',
    companyTitle: 'For companies',
    companyText: 'Create a listing with contact person, requirements and work tasks.',
    localTitle: 'Local focus',
    localText: 'The platform starts in Nakskov, giving young people and companies one simple local place to meet.',
    overview: 'Job overview',
    currentListings: 'Current opportunities',
    listingsFound: 'listings found',
    search: 'Search',
    searchPlaceholder: 'Search by job or company',
    type: 'Type',
    all: 'All',
    noMatchesTitle: 'No listings match your search',
    noMatchesText: 'Try another job type or a broader search term.',
    age: 'Age',
    time: 'Time',
    salary: 'Pay',
    deadline: 'Deadline',
    tasks: 'Tasks',
    requirements: 'Requirements',
    aboutCompany: 'About the company',
    howToApply: 'How to apply',
    readListing: 'Read listing',
    readMore: 'Read more',
    showLess: 'Show less',
    aboutJob: 'About the job',
    jobFacts: 'Job facts',
    posted: 'Date',
    contactPersonLabel: 'Contact person',
    email: 'Email',
    phoneLabel: 'Phone',
    applicationDeadlineLabel: 'Application deadline',
    sendEmail: 'Send email',
    callPhone: 'Call',
    contactCompany: 'Contact company',
    companySectionTitle: 'Create a serious listing in a few minutes.',
    companySectionText:
      'Create local job listings with clear contact details, requirements and tasks so young people can quickly assess the opportunity.',
    checkContact: 'Contact information is collected in one place',
    checkDetails: 'The listing includes type, age, location and working hours',
    checkDatabase: 'Applications are received in the company dashboard',
    formIntro: 'Fill in the required content before sending the listing.',
    formError: 'Check that all fields are filled in and that the email is valid.',
    formSuccess: 'The listing has been created and is now shown on the platform.',
    company: 'Company',
    contactPerson: 'Contact person',
    phone: 'Phone',
    title: 'Listing title',
    city: 'Town',
    agePlaceholder: 'E.g. 15+ years',
    hours: 'Working hours',
    hoursPlaceholder: 'E.g. 6-10 hours per week',
    description: 'Short description',
    descriptionPlaceholder: 'Describe tasks, expectations and how the young person applies.',
    sendListing: 'Send listing',
    footerText: 'Pilot platform for young people, companies and local opportunities.',
  },
} as const

const jobs: Job[] = [
  {
    id: 1,
    companyId: 1,
    status: 'Aktiv',
    postedAgo: 'i dag',
    applicantsCount: 3,
    tags: ['Fritidsjob', 'Kundeservice', 'Efter skole'],
    verified: true,
    payLabel: 'Overenskomst',
    title: 'Fritidsmedarbejder til butik',
    company: 'Nakskov Nærbutik',
    companyProfile:
      'Nakskov Nærbutik er en lokal dagligvarebutik med faste kunder, et lille team og travle eftermiddage efter skole og arbejde.',
    location: 'Nakskov',
    type: 'Fritidsjob',
    age: '15+ år',
    hours: '6-10 timer om ugen',
    salary: 'Efter gældende overenskomst',
    deadline: 'Løbende ansættelse',
    posted: 'Opslået i dag',
    contactPerson: 'Mette Hansen',
    contactEmail: 'job@nakskovnaerbutik.dk',
    contactPhone: '54 92 18 40',
    applicationDeadline: 'Løbende ansættelse',
    description:
      'Vi søger en stabil fritidsmedarbejder til eftermiddag og weekend, som har lyst til at lære kundeservice, vareopfyldning og butikshverdag i praksis.',
    body: [
      'Du bliver en del af et lille team, hvor vi hjælper hinanden, taler ordentligt til kunderne og sørger for, at butikken er klar til de travle perioder.',
      'Jobbet passer godt til dig, der gerne vil have dit første fritidsjob og lære at tage ansvar i trygge rammer. Du får oplæring fra en fast medarbejder og starter med simple opgaver.',
      'Vi lægger vægt på stabilitet, god energi og lysten til at møde kunder med et smil. Erfaring er ikke nødvendig.',
    ],
    tasks: ['Kundeservice', 'Vareopfyldning', 'Let oprydning', 'Hjælp ved kassen'],
    requirements: ['Du møder til tiden', 'Du kan tale med kunder', 'Du har lyst til at lære'],
    application: 'Send en kort mail med dit navn, alder, skole og hvorfor du gerne vil arbejde i butikken.',
  },
  {
    id: 2,
    companyId: 2,
    status: 'Aktiv',
    postedAgo: 'for 2 dage siden',
    applicantsCount: 5,
    tags: ['Praktik', 'Håndværk', 'Skoleforløb'],
    verified: true,
    payLabel: 'Ulønnet praktik',
    title: 'Praktik hos lokal håndværker',
    company: 'Nakskov Håndværk',
    companyProfile:
      'Nakskov Håndværk arbejder med renovering, mindre byggerier og serviceopgaver for private og lokale virksomheder i Nakskov.',
    location: 'Nakskov',
    type: 'Praktik',
    age: '14+ år',
    hours: 'Efter aftale med skole',
    salary: 'Ulønnet praktik',
    deadline: 'Ansøg senest 28. juni',
    posted: 'Opslået for 2 dage siden',
    contactPerson: 'Jesper Madsen',
    contactEmail: 'praktik@nakskovhaandvaerk.dk',
    contactPhone: '54 78 22 16',
    applicationDeadline: '28. juni 2026',
    description:
      'Få indblik i hverdagen på byggepladser og værksted. Praktikken passer til dig, der er nysgerrig på håndværk og gerne vil prøve kræfter med konkrete opgaver.',
    body: [
      'Som praktikant følger du en erfaren medarbejder og får lov til at se, hvordan en arbejdsdag i byggebranchen fungerer fra morgenmøde til oprydning.',
      'Du kommer ikke til at stå alene med farlige opgaver, men du får mulighed for at hjælpe med materialer, værktøj og simple praktiske opgaver under opsyn.',
      'Forløbet kan tilpasses din skole og dine interesser, så du både får et realistisk indblik og en god oplevelse.',
    ],
    tasks: ['Følge en svend', 'Klargøre materialer', 'Se forskellige fagområder', 'Lære om sikkerhed'],
    requirements: ['Du er nysgerrig', 'Du kan arbejde praktisk', 'Du følger sikkerhedsinstrukser'],
    application: 'Skriv hvilken skole du går på, hvilken uge du søger praktik i, og hvorfor du er nysgerrig på håndværk.',
  },
  {
    id: 3,
    companyId: 3,
    status: 'Aktiv',
    postedAgo: 'for 4 dage siden',
    applicantsCount: 8,
    tags: ['Sommerjob', 'Service', 'Weekend'],
    verified: true,
    payLabel: 'Timeløn',
    title: 'Sommerhjælp på café',
    company: 'Nakskov Café',
    companyProfile:
      'Nakskov Café er en lokal café med gæster fra byen, havnen og familier i sommerperioden.',
    location: 'Nakskov',
    type: 'Sommerjob',
    age: '16+ år',
    hours: '10-20 timer om ugen',
    salary: 'Timeløn efter aftale',
    deadline: 'Ansøg senest 15. juni',
    posted: 'Opslået for 4 dage siden',
    contactPerson: 'Sofie Larsen',
    contactEmail: 'kontakt@nakskovcafe.dk',
    contactPhone: '54 85 30 12',
    applicationDeadline: '15. juni 2026',
    description:
      'Caféen søger sommerhjælp til betjening, oprydning og lettere køkkenopgaver. Du får oplæring og arbejder sammen med erfarne kolleger.',
    body: [
      'Sommerperioden er travl, og derfor søger vi en ung medarbejder, der har lyst til at være en del af et serviceorienteret team.',
      'Du kommer til at hjælpe med gæster, borde, simple serveringer og klargøring. Vi sørger for oplæring, så du kender rutinerne, før du får mere ansvar.',
      'Jobbet er især relevant for dig, der trives med tempo, smilende gæster og varierende vagter.',
    ],
    tasks: ['Tage imod gæster', 'Servere mad og drikke', 'Holde caféen pæn', 'Hjælpe i køkkenet'],
    requirements: ['Du er serviceminded', 'Du kan holde tempo', 'Du kan arbejde i weekender'],
    application: 'Send en mail med kontaktoplysninger, alder og hvilke uger du kan arbejde i sommerferien.',
  },
  {
    id: 4,
    companyId: 4,
    status: 'Aktiv',
    postedAgo: 'for 1 uge siden',
    applicantsCount: 2,
    tags: ['Fritidsjob', 'Lager', 'Efter skole'],
    verified: false,
    payLabel: 'Timeløn',
    title: 'Ung hjælper til lager',
    company: 'Nakskov Lager & Logistik',
    companyProfile:
      'Nakskov Lager & Logistik håndterer lokale leveringer, sortering og pakkeopgaver for butikker og mindre virksomheder i Nakskov.',
    location: 'Nakskov',
    type: 'Fritidsjob',
    age: '16+ år',
    hours: '8 timer om ugen',
    salary: 'Timeløn efter aftale',
    deadline: 'Løbende ansættelse',
    posted: 'Opslået for 1 uge siden',
    contactPerson: 'Kasper Nielsen',
    contactEmail: 'hr@nakskovlogistik.dk',
    contactPhone: '54 60 44 28',
    applicationDeadline: 'Løbende ansættelse',
    description:
      'Lagerteamet søger en ung medarbejder til simple lageropgaver efter skole. Du får faste opgaver, tydelig oplæring og mulighed for flere timer i ferier.',
    body: [
      'Arbejdet foregår på lageret i Nakskov, hvor du hjælper med pakning, sortering og kontrol af varer. Opgaverne er konkrete, og du får en fast kontaktperson.',
      'Vi leder efter en medarbejder, der kan arbejde grundigt og holde orden, også når der er flere opgaver på samme tid.',
      'Du behøver ikke have erfaring med lagerarbejde. Det vigtigste er, at du møder stabilt og spørger, når du er i tvivl.',
    ],
    tasks: ['Pakke varer', 'Sortere leveringer', 'Scanne pakker', 'Holde orden på lageret'],
    requirements: ['Du er grundig', 'Du kan løfte lette pakker', 'Du kan arbejde selvstændigt'],
    application: 'Send en kort mail med navn, alder, telefonnummer og hvornår du kan arbejde efter skole.',
  },
  {
    id: 5,
    companyId: 5,
    status: 'Aktiv',
    postedAgo: 'for 1 uge siden',
    applicantsCount: 4,
    tags: ['Praktik', 'Omsorg', 'Introforløb'],
    verified: true,
    payLabel: 'Ulønnet praktik',
    title: 'Introduktion til social- og sundhedsområdet',
    company: 'Nakskov Pleje & Omsorg',
    companyProfile:
      'Lokal Plejeenhed arbejder med pleje, omsorg og aktiviteter for borgere i nærområdet.',
    location: 'Nakskov',
    type: 'Praktik',
    age: '15+ år',
    hours: 'Efter aftale',
    salary: 'Ulønnet praktik',
    deadline: 'Kontakt for datoer',
    posted: 'Opslået for 1 uge siden',
    contactPerson: 'Anne Petersen',
    contactEmail: 'praktik@nakskovpleje.dk',
    contactPhone: '54 12 34 56',
    applicationDeadline: 'Kontakt for datoer',
    description:
      'Et praktikforløb for dig, der overvejer en fremtid med mennesker, omsorg og ansvar. Du følger medarbejdere og får et realistisk indblik i arbejdet.',
    body: [
      'I praktikken får du mulighed for at se, hvordan medarbejdere arbejder med omsorg, struktur og nærvær i hverdagen.',
      'Du følger medarbejdere, deltager i relevante aktiviteter og får tid til at stille spørgsmål om uddannelse, arbejdsliv og muligheder i faget.',
      'Forløbet er særligt relevant, hvis du overvejer social- og sundhedsuddannelse eller gerne vil vide mere om arbejde med mennesker.',
    ],
    tasks: ['Følge medarbejdere', 'Hjælpe med aktiviteter', 'Lære om arbejdsgange', 'Stille spørgsmål til uddannelse'],
    requirements: ['Du er respektfuld', 'Du kan møde stabilt', 'Du har interesse for mennesker'],
    application: 'Skriv kort om dig selv, hvilken skole du går på, og hvornår du ønsker praktik.',
  },
  {
    id: 6,
    companyId: 6,
    status: 'Aktiv',
    postedAgo: 'i dag',
    applicantsCount: 0,
    tags: ['Fritidsjob', 'Delikatesse', 'Kundeservice', 'Efter skole'],
    verified: true,
    payLabel: 'Overenskomst',
    companyLogo: '/logos/meny-logo.png',
    jobImage: '/jobs/meny-delikatesse.png',
    title: 'Delikatessehjælper',
    company: 'MENY Nakskov',
    companyProfile:
      'MENY Nakskov er en lokal dagligvarebutik med fokus på kvalitet, kundeservice og stærkt lokalt fællesskab.',
    location: 'Nakskov',
    type: 'Fritidsjob',
    age: '16+ år',
    hours: '8-12 timer om ugen',
    salary: 'Efter gældende overenskomst',
    deadline: 'Løbende ansættelse',
    posted: 'Opslået i dag',
    contactPerson: 'Anders Jakobsen',
    contactEmail: 'nakskov@meny.dk',
    contactPhone: '',
    applicationDeadline: 'Løbende ansættelse',
    description:
      'MENY Nakskov søger en ung hjælper til delikatesseafdelingen efter skole og i weekender.',
    body: [
      'MENY Nakskov søger en ung hjælper til delikatesseafdelingen efter skole og i weekender.',
      'Du bliver en del af et stærkt team, hvor samarbejde, kvalitet og god stemning er en naturlig del af hverdagen.',
      'Vi søger en medarbejder, der brænder for gode råvarer, kundeservice og udvikling af delikatesseafdelingen.',
      'Du får en afdeling i udvikling, hvor dine idéer bliver hørt, gode kolleger og en arbejdsplads med stærkt lokalt fællesskab.',
      'Stillingen giver mulighed for at præge både drift og sortiment i en hverdag med tempo, faglighed og masser af kundekontakt.',
    ],
    tasks: [
      'Daglig drift af delikatesseafdelingen sammen med resten af teamet',
      'Håndtering af fødevarer efter gældende regler og standarder',
      'Orden og hygiejne i både produktion og udstilling',
      'Udvikling af afdelingen med nye idéer, retter og kundeoplevelser',
      'Samarbejde om drift, planlægning og kundeservice',
      'Mad ud af huset',
    ],
    requirements: [
      'Er faglært inden for delikatesse, smørrebrød, catering eller lignende',
      'Har styr på reglerne inden for fødevaresikkerhed og egenkontrol',
      'Trives i et team, hvor man hjælper hinanden',
      'Er struktureret, ordensmenneske og tager ansvar',
      'Har lyst til at udvikle afdelingen sammen med os',
      'Kan arbejde hver anden lørdag og hver fjerde søndag',
    ],
    benefits: [
      'En afdeling i udvikling, hvor dine idéer bliver hørt',
      'Gode kolleger og en arbejdsplads med stærkt lokalt fællesskab',
      'En hverdag med tempo, faglighed og masser af kundekontakt',
      'Mulighed for at præge både drift og sortiment',
      'Fritidsjob med faste vagter',
    ],
    applicationText:
      'Send din ansøgning gennem NAKSKOV. Vi glæder os til at høre fra dig.',
    application:
      'Send din ansøgning gennem NAKSKOV. Vi glæder os til at høre fra dig.',
  },
]

const companies: Company[] = [
  {
    id: 1,
    name: 'Nakskov Nærbutik',
    description:
      'Nakskov Nærbutik er en lokal dagligvarebutik med faste kunder, et lille team og travle eftermiddage efter skole og arbejde.',
    contactEmail: 'job@nakskovnaerbutik.dk',
    contactPhone: '54 92 18 40',
  },
  {
    id: 2,
    name: 'Nakskov Håndværk',
    description:
      'Nakskov Håndværk arbejder med renovering, mindre byggerier og serviceopgaver for private og lokale virksomheder i Nakskov.',
    contactEmail: 'praktik@nakskovhaandvaerk.dk',
    contactPhone: '54 78 22 16',
  },
  {
    id: 3,
    name: 'Nakskov Café',
    description:
      'Nakskov Café er en lokal café med gæster fra byen, havnen og familier i sommerperioden.',
    contactEmail: 'kontakt@nakskovcafe.dk',
    contactPhone: '54 85 30 12',
  },
  {
    id: 4,
    name: 'Nakskov Lager & Logistik',
    description:
      'Nakskov Lager & Logistik håndterer lokale leveringer, sortering og pakkeopgaver for butikker og mindre virksomheder i Nakskov.',
    contactEmail: 'hr@nakskovlogistik.dk',
    contactPhone: '54 60 44 28',
  },
  {
    id: 5,
    name: 'Nakskov Pleje & Omsorg',
    description:
      'Lokal Plejeenhed arbejder med pleje, omsorg og aktiviteter for borgere i nærområdet.',
    contactEmail: 'praktik@nakskovpleje.dk',
    contactPhone: '54 12 34 56',
  },
  {
    id: 6,
    name: 'MENY Nakskov',
    logoUrl: '/logos/meny-logo.png',
    coverImageUrl: '/jobs/meny-delikatesse.png',
    description:
      'MENY Nakskov er en lokal dagligvarebutik med fokus på kvalitet, kundeservice og stærkt lokalt fællesskab.',
    website: 'https://meny.dk',
    contactEmail: 'nakskov@meny.dk',
    contactPhone: '',
  },
]

const PILOT_CITY = 'Nakskov'

const initialForm: FormState = {
  company: '',
  contactName: '',
  email: '',
  phone: '',
  title: '',
  type: 'Fritidsjob',
  location: PILOT_CITY,
  age: '',
  hours: '',
  description: '',
  companyLogoFileName: '',
  companyLogoUrl: '',
  jobImageFileName: '',
  jobImageUrl: '',
}

const initialApplicationForm: ApplicationFormState = {
  applicantName: 'Emma Jensen',
  applicantEmail: 'emma.jensen@example.dk',
  applicantPhone: '22 33 44 55',
  applicantAge: '17',
  applicantCity: PILOT_CITY,
  applicantEducation: '10. klasse',
  message: '',
  cvFile: null,
  cvFileName: 'emma-jensen-cv.pdf',
  cvFileUrl: '/cv/emma-jensen-cv.pdf',
  profileImageUrl: '',
  gdprConsent: false,
}

const initialJobSeekerSignup: JobSeekerSignupState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  age: '',
  city: PILOT_CITY,
  phone: '',
  bio: '',
  cvFileName: '',
  cvFileUrl: '',
}

const initialCompanySignup: CompanySignupState = {
  companyName: '',
  cvr: '',
  industry: '',
  website: '',
  contactPerson: '',
  contactRole: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  description: '',
  logoFileName: '',
  logoUrl: '',
}

// TODO Supabase: Load companyJobs from jobs filtered by company_id.
const companyJobs: CompanyJob[] = [
  {
    id: 1,
    title: 'Delikatessehjælper',
    type: 'Fritidsjob',
    location: PILOT_CITY,
    status: 'Aktiv',
    applicantsCount: 6,
    postedDate: '6. juni 2026',
  },
  {
    id: 2,
    title: 'Fritidsmedarbejder til butik',
    type: 'Fritidsjob',
    location: PILOT_CITY,
    status: 'Aktiv',
    applicantsCount: 3,
    postedDate: '4. juni 2026',
  },
  {
    id: 3,
    title: 'Sommerhjælp på café',
    type: 'Sommerjob',
    location: PILOT_CITY,
    status: 'Kladde',
    applicantsCount: 0,
    postedDate: 'Ikke udgivet',
  },
]

// TODO Supabase: Load applicantProfiles by joining applications, profiles and jobs.
const applicantProfiles: ApplicantProfile[] = [
  {
    id: 1,
    name: 'Emma Jensen',
    age: '17',
    city: PILOT_CITY,
    education: '10. klasse',
    email: 'emma.jensen@example.dk',
    phone: '22 33 44 55',
    appliedJob: 'Delikatessehjælper',
    applicationDate: '6. juni 2026',
    status: 'Svar modtaget',
    cvUrl: '/cv/emma-jensen-cv.pdf',
  },
  {
    id: 2,
    name: 'Lucas Petersen',
    age: '18',
    city: PILOT_CITY,
    education: 'EUX Business',
    email: 'lucas@example.dk',
    phone: '28 44 19 02',
    appliedJob: 'Fritidsmedarbejder til butik',
    applicationDate: '5. juni 2026',
    status: 'Svar modtaget',
    cvUrl: '/cv/lucas-petersen-cv.pdf',
  },
  {
    id: 3,
    name: 'Sara Holm',
    age: '16',
    city: PILOT_CITY,
    education: 'HF-forberedende',
    email: 'sara@example.dk',
    phone: '31 70 45 80',
    appliedJob: 'Sommerhjælp på café',
    applicationDate: '3. juni 2026',
    status: 'Svar modtaget',
    cvUrl: '/cv/sara-holm-cv.pdf',
  },
]

// TODO Supabase: Load applications from applications and map status for job seeker dashboard.
const dashboardApplications = [
  {
    id: 1,
    title: 'Delikatessehjælper',
    company: 'MENY Nakskov',
    location: PILOT_CITY,
    sentDate: '6. juni 2026',
    status: 'Ansøgning sendt' as JobSeekerApplicationStatus,
  },
  {
    id: 2,
    title: 'Praktik hos lokal håndværker',
    company: 'Nakskov Håndværk',
    location: PILOT_CITY,
    sentDate: '1. juni 2026',
    status: 'Svar modtaget' as JobSeekerApplicationStatus,
    replyMessage: 'Tak for ansøgningen. Vi vender tilbage hurtigst muligt.',
  },
  {
    id: 3,
    title: 'Sommerhjælp på café',
    company: 'Nakskov Café',
    location: PILOT_CITY,
    sentDate: '29. maj 2026',
    status: 'Svar modtaget' as JobSeekerApplicationStatus,
    replyMessage: 'Virksomheden vil gerne tale med dig',
  },
]

// TODO Supabase: Load notifications from notifications filtered by user_id.
const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Virksomheden har åbnet din ansøgning',
    text: 'MENY Nakskov har set dit digitale CV.',
    time: 'I dag',
  },
  {
    id: 2,
    title: 'Du har fået svar',
    text: 'Nakskov Café har sendt en besked om sommerjobbet.',
    time: 'I går',
  },
  {
    id: 3,
    title: 'Nyt job matcher din profil',
    text: 'Et fritidsjob i Nakskov matcher dine interesser.',
    time: 'For 2 dage siden',
  },
]

// TODO Supabase tables for next backend phase:
// auth.users, profiles, companies, company_users, jobs, applications, saved_jobs, saved_candidates, notifications.
// TODO Supabase Storage buckets:
// cv-files, profile-images, company-logos, job-images.

function App() {
  const [language] = useState<Language>('da')
  const [activeView, setActiveView] = useState<AppView>('home')
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [signupStep, setSignupStep] = useState<SignupStep>('select')
  const [authError, setAuthError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [selectedLoginRole, setSelectedLoginRole] = useState<'jobseeker' | 'company'>('jobseeker')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [jobSeekerSignup, setJobSeekerSignup] = useState<JobSeekerSignupState>(initialJobSeekerSignup)
  const [companySignup, setCompanySignup] = useState<CompanySignupState>(initialCompanySignup)
  const [activeTab, setActiveTab] = useState('Job')
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<'Alle' | JobType>('Alle')
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0])
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [, setExpandedDescription] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [createdJobs, setCreatedJobs] = useState<Job[]>([])
  const [createdCompanyJobs, setCreatedCompanyJobs] = useState<CompanyJob[]>([])
  const [companyJobOverrides, setCompanyJobOverrides] = useState<Record<number, Partial<CompanyJob>>>({})
  const [jobApplicantCountById, setJobApplicantCountById] = useState<Record<number, number>>({})
  const isCompanyLoggedIn = userRole === 'company'
  const [showCompanyAccountModal, setShowCompanyAccountModal] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [applicationForm, setApplicationForm] = useState<ApplicationFormState>(initialApplicationForm)
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [applicationError, setApplicationError] = useState('')
  const [cvInputKey, setCvInputKey] = useState(0)
  const mockProfileCv = {
    fileName: 'emma-jensen-cv.pdf',
    url: '/cv/emma-jensen-cv.pdf',
  }
  const [existingProfileCv, setExistingProfileCv] = useState<{ fileName: string; url: string } | null>(null)
  const [selectedCvFile, setSelectedCvFile] = useState<{ fileName: string; url: string; source: 'profile' | 'upload' } | null>(null)
  const [cvError, setCvError] = useState('')
  // TODO Supabase: Persist saved jobs in saved_jobs with id, user_id, job_id and created_at.
  const [savedJobIds, setSavedJobIds] = useState<number[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const t = copy[language]
  const hasValidApplicationEmail = /^\S+@\S+\.\S+$/.test(applicationForm.applicantEmail)
  const canSubmitApplication =
    applicationForm.applicantName.trim().length > 0 &&
    hasValidApplicationEmail &&
    applicationForm.applicantPhone.trim().length > 0 &&
    selectedCvFile !== null &&
    applicationForm.gdprConsent
  const tabs = [
    { label: 'Job', href: '#jobs', key: 'Job', type: 'Alle' as const },
    { label: 'Praktik', href: '#jobs', key: 'Praktik', type: 'Praktik' as JobType },
    { label: 'Læreplads', href: '#jobs', key: 'Læreplads', type: 'Læreplads' as JobType },
    { label: 'For virksomheder', href: '#companies', key: 'For virksomheder' },
  ] as const

  const allJobs = useMemo(
    () => [...createdJobs, ...jobs].map((job) => ({ ...job, applicantsCount: job.applicantsCount + (jobApplicantCountById[job.id] ?? 0) })),
    [createdJobs, jobApplicantCountById],
  )
  const allCompanyJobs = useMemo(
    () =>
      [...createdCompanyJobs, ...companyJobs].map((job) => ({
        ...job,
        ...companyJobOverrides[job.id],
        applicantsCount: job.applicantsCount + (jobApplicantCountById[job.id] ?? 0),
      })),
    [createdCompanyJobs, companyJobOverrides, jobApplicantCountById],
  )

  function showHomeView(nextTab = 'Job', nextType?: JobType | 'Alle', targetId?: string) {
    setIsMobileMenuOpen(false)
    setActiveView('home')
    setActiveTab(nextTab)
    if (nextType) {
      setSelectedType(nextType)
    }
    if (targetId) {
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
    }
  }

  function returnToFrontPage(targetId = 'home') {
    setIsMobileMenuOpen(false)
    setActiveView('home')
    setActiveTab('Job')
    window.history.replaceState(null, '', '#home')
    window.setTimeout(() => {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  function openSignupModal(step: SignupStep = 'select') {
    setIsMobileMenuOpen(false)
    setSignupStep(step)
    setAuthError('')
    setShowRoleModal(true)
  }

  function openLoginModal(role?: 'jobseeker' | 'company') {
    setIsMobileMenuOpen(false)
    if (role) {
      setSelectedLoginRole(role)
    }
    setAuthError('')
    setIsLoginLoading(false)
    setShowLoginModal(true)
  }

  function logout() {
    setIsMobileMenuOpen(false)
    setUserRole('guest')
    setShowLoginModal(false)
    setShowRoleModal(false)
    setExistingProfileCv(null)
    setSelectedCvFile(null)
    setActiveView('home')
    setActiveTab('Job')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Vi kunne ikke logge dig ind. Tjek e-mail og adgangskode.')
      return
    }

    // TODO Supabase: Replace mock login with Supabase Auth.
    // TODO Supabase: Check user role from profiles/company_users table.
    setAuthError('')
    setIsLoginLoading(true)

    window.setTimeout(() => {
      if (selectedLoginRole === 'jobseeker') {
        const profileCv = { fileName: mockProfileCv.fileName, url: mockProfileCv.url, source: 'profile' as const }
        setExistingProfileCv(mockProfileCv)
        setSelectedCvFile(profileCv)
        const fullName = [jobSeekerSignup.firstName, jobSeekerSignup.lastName].filter(Boolean).join(' ')
        setApplicationForm((current) => ({
          ...current,
          applicantName: fullName || initialApplicationForm.applicantName,
          applicantEmail: loginEmail || jobSeekerSignup.email || initialApplicationForm.applicantEmail,
          applicantPhone: jobSeekerSignup.phone || initialApplicationForm.applicantPhone,
          applicantAge: jobSeekerSignup.age || initialApplicationForm.applicantAge,
          applicantCity: PILOT_CITY,
          applicantEducation: initialApplicationForm.applicantEducation,
          cvFileName: profileCv?.fileName ?? '',
          cvFileUrl: profileCv?.url ?? '',
        }))
        setUserRole('jobseeker')
        setActiveView('jobseeker-dashboard')
      } else {
        setUserRole('company')
        setActiveView('company-dashboard')
      }

      setShowLoginModal(false)
      setIsLoginLoading(false)
    }, 500)
  }

  function updateJobSeekerSignup<K extends keyof JobSeekerSignupState>(field: K, value: JobSeekerSignupState[K]) {
    setJobSeekerSignup((current) => ({ ...current, [field]: value }))
    setAuthError('')
  }

  function updateCompanySignup<K extends keyof CompanySignupState>(field: K, value: CompanySignupState[K]) {
    setCompanySignup((current) => ({ ...current, [field]: value }))
    setAuthError('')
  }

  function handleSignupCvUpload(file: File | undefined) {
    if (!file) {
      return
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const maxSize = 10 * 1024 * 1024

    if (!isPdf) {
      setAuthError('Kun PDF-filer er tilladt.')
      return
    }

    if (file.size > maxSize) {
      setAuthError('CV-filen må maksimalt være 10 MB.')
      return
    }

    // TODO Supabase Storage: Upload CV to cv-files bucket and save cv_file_url on profiles.
    const localPreviewUrl = URL.createObjectURL(file)
    setJobSeekerSignup((current) => ({
      ...current,
      cvFileName: file.name,
      cvFileUrl: localPreviewUrl,
    }))
    setAuthError('')
  }

  function handleCompanyLogoUpload(file: File | undefined) {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setAuthError('Logo skal være et billede.')
      return
    }

    // TODO Supabase Storage: Upload company logo to company-logos bucket and save logoUrl on companies.
    const localPreviewUrl = URL.createObjectURL(file)
    setCompanySignup((current) => ({
      ...current,
      logoFileName: file.name,
      logoUrl: localPreviewUrl,
    }))
    setAuthError('')
  }

  function submitJobSeekerSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !jobSeekerSignup.firstName.trim() ||
      !jobSeekerSignup.lastName.trim() ||
      !jobSeekerSignup.age.trim() ||
      !jobSeekerSignup.phone.trim() ||
      !/^\S+@\S+\.\S+$/.test(jobSeekerSignup.email) ||
      jobSeekerSignup.password.length < 6
    ) {
      setAuthError('Udfyld fornavn, efternavn, alder, telefon, gyldig e-mail og password på mindst 6 tegn.')
      return
    }

    // TODO Supabase: Create auth.users record and profiles row for jobsøgende.
    if (jobSeekerSignup.cvFileName && jobSeekerSignup.cvFileUrl) {
      const profileCv = {
        fileName: jobSeekerSignup.cvFileName,
        url: jobSeekerSignup.cvFileUrl,
        source: 'profile',
      } as const
      setExistingProfileCv({ fileName: profileCv.fileName, url: profileCv.url })
      setSelectedCvFile(profileCv)
    } else {
      setExistingProfileCv(null)
      setSelectedCvFile(null)
    }
    const fullName = [jobSeekerSignup.firstName, jobSeekerSignup.lastName].join(' ')
    setApplicationForm((current) => ({
      ...current,
      applicantName: fullName,
      applicantEmail: jobSeekerSignup.email,
      applicantPhone: jobSeekerSignup.phone,
      applicantAge: jobSeekerSignup.age,
      applicantCity: jobSeekerSignup.city,
      cvFileName: jobSeekerSignup.cvFileName,
      cvFileUrl: jobSeekerSignup.cvFileUrl,
    }))
    setUserRole('jobseeker')
    setShowRoleModal(false)
    setActiveView('jobseeker-dashboard')
  }

  function submitCompanySignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !companySignup.companyName.trim() ||
      !companySignup.contactPerson.trim() ||
      !companySignup.phone.trim() ||
      !companySignup.description.trim() ||
      !/^\S+@\S+\.\S+$/.test(companySignup.email) ||
      companySignup.password.length < 6
    ) {
      setAuthError('Udfyld virksomhedsnavn, kontaktperson, telefon, beskrivelse, gyldig e-mail og password på mindst 6 tegn.')
      return
    }

    // TODO Supabase: Create auth.users, companies and company_users rows for virksomhed.
    setUserRole('company')
    setShowRoleModal(false)
    setActiveView('company-dashboard')
  }

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return allJobs.filter((job) => {
      const matchesType = selectedType === 'Alle' || job.type === selectedType
      const matchesSearch =
        query.length === 0 ||
        [job.title, job.company, job.location, job.description, job.type]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesType && matchesSearch
    })
  }, [allJobs, search, selectedType])

  const jobSeekerApplications = useMemo(() => {
    const platformApplications = applications.map((application) => {
      const job = allJobs.find((item) => item.id === application.job_id)

      return {
        id: application.id,
        title: job?.title ?? 'Ukendt opslag',
        company: job?.company ?? 'Ukendt virksomhed',
        location: job?.location ?? PILOT_CITY,
        sentDate: formatApplicationDate(application.created_at),
        status: application.status,
        replyMessage: application.company_reply_message,
      }
    })

    return [...platformApplications, ...dashboardApplications]
  }, [allJobs, applications])

  const savedProfileJobs = useMemo(() => {
    return allJobs.filter((job) => savedJobIds.includes(job.id))
  }, [allJobs, savedJobIds])

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJob(null)
      setIsJobModalOpen(false)
      setExpandedDescription(false)
      return
    }

    if (!selectedJob || !filteredJobs.some((job) => job.id === selectedJob.id)) {
      setSelectedJob(filteredJobs[0])
      setExpandedDescription(false)
    }
  }, [filteredJobs, selectedJob])

  useEffect(() => {
    if (!isJobModalOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsJobModalOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isJobModalOpen])

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  function updateForm<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setFormErrorMessage('')
    setFormStatus('idle')
  }

  function handleListingImageUpload(file: File | undefined, kind: 'companyLogo' | 'jobImage') {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setFormErrorMessage('Billedet skal være en gyldig billedfil.')
      setFormStatus('error')
      return
    }

    // TODO Supabase Storage: Upload company logos to company-logos and recruitment images to job-images.
    const localPreviewUrl = URL.createObjectURL(file)
    setForm((current) => ({
      ...current,
      ...(kind === 'companyLogo'
        ? { companyLogoFileName: file.name, companyLogoUrl: localPreviewUrl }
        : { jobImageFileName: file.name, jobImageUrl: localPreviewUrl }),
    }))
    setFormErrorMessage('')
    setFormStatus('idle')
  }

  function updateApplicationForm<K extends keyof ApplicationFormState>(field: K, value: ApplicationFormState[K]) {
    setApplicationForm((current) => ({ ...current, [field]: value }))
  }

  function sendApplicationReply(applicationId: number, message: string) {
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId
          ? { ...application, status: 'Svar modtaget', company_reply_message: message }
          : application,
      ),
    )
    showToast('Svar sendt til ansøger')
  }

  function handleCvUpload(file: File | undefined) {
    if (!file) {
      return
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const maxSize = 10 * 1024 * 1024

    if (!isPdf) {
      setApplicationError('Kun PDF-filer er tilladt.')
      setApplicationStatus('error')
      setCvError('Kun PDF-filer er tilladt.')
      return
    }

    if (file.size > maxSize) {
      setApplicationError('CV-filen må maksimalt være 10 MB.')
      setApplicationStatus('error')
      setCvError('CV-filen må maksimalt være 10 MB.')
      return
    }

    // TODO Supabase Storage: Upload CV to cv-files bucket.
    // TODO Supabase: Save cv_file_url on profile when user chooses to keep this CV.
    const localPreviewUrl = URL.createObjectURL(file)
    const uploadedCv = { fileName: file.name, url: localPreviewUrl, source: 'upload' as const }

    setSelectedCvFile(uploadedCv)
    setApplicationForm((current) => ({
      ...current,
      cvFile: file,
      cvFileName: uploadedCv.fileName,
      cvFileUrl: uploadedCv.url,
    }))
    setApplicationStatus('idle')
    setApplicationError('')
    setCvError('')
  }

  function useProfileCv() {
    if (!existingProfileCv) {
      setCvError('Upload venligst dit CV som PDF.')
      return
    }

    const profileCv = { fileName: existingProfileCv.fileName, url: existingProfileCv.url, source: 'profile' as const }
    setSelectedCvFile(profileCv)
    setApplicationForm((current) => ({
      ...current,
      cvFile: null,
      cvFileName: profileCv.fileName,
      cvFileUrl: profileCv.url,
    }))
    setApplicationStatus('idle')
    setApplicationError('')
    setCvError('')
  }

  function removeCvFile() {
    setSelectedCvFile(null)
    setApplicationForm((current) => ({
      ...current,
      cvFile: null,
      cvFileName: '',
      cvFileUrl: '',
    }))
    setCvInputKey((current) => current + 1)
    setApplicationStatus('idle')
    setApplicationError('')
    setCvError('')
  }

  function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isCompanyLoggedIn) {
      setShowCompanyAccountModal(true)
      return
    }

    if (form.location.trim().length === 0) {
      setFormErrorMessage('Vælg venligst en by.')
      setFormStatus('error')
      return
    }

    const requiredFields: Array<keyof FormState> = [
      'company',
      'contactName',
      'email',
      'title',
      'age',
      'hours',
      'description',
    ]

    const hasMissingFields = requiredFields.some((field) => form[field].trim().length === 0)
    const hasValidEmail = /^\S+@\S+\.\S+$/.test(form.email)

    if (hasMissingFields || !hasValidEmail) {
      setFormErrorMessage(t.formError)
      setFormStatus('error')
      return
    }

    const newJobId = Date.now()
    const newJob: Job = {
      id: newJobId,
      companyId: 999,
      status: 'Aktiv',
      postedAgo: 'i dag',
      applicantsCount: 0,
      verified: true,
      tags: [form.type, form.location, 'Lokalt job'],
      payLabel: 'Efter aftale',
      companyLogo: form.companyLogoUrl || undefined,
      jobImage: form.jobImageUrl || undefined,
      title: form.title.trim(),
      company: form.company.trim(),
      companyProfile: `${form.company.trim()} opretter lokale jobmuligheder på NAKSKOV.`,
      location: form.location,
      type: form.type,
      age: form.age.trim(),
      hours: form.hours.trim(),
      salary: 'Efter aftale',
      deadline: 'Løbende ansættelse',
      posted: 'Opslået i dag',
      contactPerson: form.contactName.trim(),
      contactEmail: form.email.trim(),
      contactPhone: form.phone.trim(),
      applicationDeadline: 'Løbende ansættelse',
      description: form.description.trim(),
      body: [form.description.trim()],
      tasks: ['Læs opslaget', 'Send ansøgning med digitalt CV', 'Afvent svar fra virksomheden'],
      requirements: ['Du har lyst til at lære', 'Du møder stabilt', 'Du kan kommunikere ordentligt'],
      application: 'Ansøg direkte gennem NAKSKOV med din profil og dit digitale CV.',
    }

    const newCompanyJob: CompanyJob = {
      id: newJobId,
      title: newJob.title,
      type: newJob.type,
      location: newJob.location,
      status: 'Aktiv',
      applicantsCount: 0,
      postedDate: 'Opslået i dag',
    }

    // TODO Supabase: Insert job in jobs table with company_id from the authenticated company.
    // TODO Supabase Storage: Save uploaded company logo in company-logos bucket and recruitment image in job-images bucket.
    setCreatedJobs((current) => [newJob, ...current])
    setCreatedCompanyJobs((current) => [newCompanyJob, ...current])
    setFormStatus('success')
    setFormErrorMessage('')
    setForm(initialForm)
    showToast('Opslag oprettet')
  }

  function openJobDetails(job: Job) {
    setSelectedJob(job)
    setIsJobModalOpen(true)
    setExpandedDescription(false)
    setApplicationStatus('idle')
    setApplicationError('')
  }

  function showToast(message: string) {
    setToastMessage(message)
  }

  function toggleSavedJob(jobId: number) {
    setSavedJobIds((currentIds) => {
      const isSaved = currentIds.includes(jobId)
      showToast(isSaved ? 'Opslag fjernet fra gemte' : 'Opslag gemt')

      return isSaved
        ? currentIds.filter((savedJobId) => savedJobId !== jobId)
        : [...currentIds, jobId]
    })
  }

  function editCompanyJob(job: CompanyJob) {
    const nextTitle = window.prompt('Ret titel på opslag', job.title)

    if (!nextTitle?.trim()) {
      return
    }

    const title = nextTitle.trim()

    setCompanyJobOverrides((current) => ({
      ...current,
      [job.id]: { ...current[job.id], title },
    }))
    setCreatedCompanyJobs((current) => current.map((item) => (item.id === job.id ? { ...item, title } : item)))
    setCreatedJobs((current) => current.map((item) => (item.id === job.id ? { ...item, title } : item)))
    showToast('Opslag opdateret')
  }

  function closeCompanyJob(jobId: number) {
    setCompanyJobOverrides((current) => ({
      ...current,
      [jobId]: { ...current[jobId], status: 'Lukket' },
    }))
    setCreatedCompanyJobs((current) => current.map((item) => (item.id === jobId ? { ...item, status: 'Lukket' } : item)))
    showToast('Opslag lukket')
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedJob) {
      return
    }

    if (applicationForm.applicantName.trim().length === 0) {
      setApplicationError('Udfyld venligst dit navn.')
      setApplicationStatus('error')
      return
    }

    if (!hasValidApplicationEmail) {
      setApplicationError('Indtast en gyldig e-mail.')
      setApplicationStatus('error')
      return
    }

    if (applicationForm.applicantPhone.trim().length === 0) {
      setApplicationError('Udfyld venligst dit telefonnummer.')
      setApplicationStatus('error')
      return
    }

    if (!selectedCvFile) {
      setApplicationError('Upload venligst dit CV som PDF.')
      setCvError('Upload venligst dit CV som PDF.')
      setApplicationStatus('error')
      return
    }

    if (!applicationForm.gdprConsent) {
      setApplicationError('Du skal acceptere deling af dine oplysninger for at sende ansøgningen.')
      setApplicationStatus('error')
      return
    }

    // TODO Supabase: Save application with cv_file_url in applications table.
    // TODO Supabase: Link application to selectedJob.id, company_id and applicant profile.
    // TODO Supabase: Restrict company access to CV unless the user applied to that company.
    const newApplication: Application = {
      id: Date.now(),
      job_id: selectedJob.id,
      company_id: selectedJob.companyId,
      applicant_profile_id: 1,
      applicant_name: applicationForm.applicantName.trim(),
      applicant_email: applicationForm.applicantEmail.trim(),
      applicant_phone: applicationForm.applicantPhone.trim(),
      applicant_age: applicationForm.applicantAge.trim(),
      applicant_city: applicationForm.applicantCity.trim(),
      applicant_education: applicationForm.applicantEducation.trim(),
      message: applicationForm.message.trim(),
      cv_file_url: selectedCvFile.url,
      cv_file_name: selectedCvFile.fileName,
      profile_image_url: applicationForm.profileImageUrl.trim(),
      status: 'Ansøgning sendt',
      created_at: new Date().toISOString(),
    }

    setApplications((current) => [newApplication, ...current])
    setJobApplicantCountById((current) => ({
      ...current,
      [selectedJob.id]: (current[selectedJob.id] ?? 0) + 1,
    }))
    setApplicationForm((current) => ({ ...current, message: '', gdprConsent: false }))
    setApplicationError('')
    setApplicationStatus('success')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <header className="absolute left-0 top-0 z-50 w-full bg-black/10 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 [text-shadow:0_1px_14px_rgba(0,0,0,0.45)] sm:px-5 sm:py-5">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              returnToFrontPage('home')
            }}
            className="min-w-0 shrink-0"
          >
            <p className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">NAKSKOV</p>
            <p className="hidden text-xs font-semibold text-slate-400 sm:block">{t.tagline}</p>
          </a>

          <nav className="hidden min-w-0 items-center gap-1 rounded-2xl border border-white/15 bg-white/10 p-1 text-sm font-semibold text-white lg:flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key

              return (
                <a
                  key={tab.key}
                  href={tab.href}
                  onClick={(event) => {
                    event.preventDefault()
                    showHomeView(tab.key, 'type' in tab ? tab.type : undefined, tab.href.replace('#', ''))
                  }}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/85 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </a>
              )
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {userRole === 'guest' && (
              <>
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="whitespace-nowrap px-2 text-sm font-semibold text-white hover:text-slate-200"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => openSignupModal('select')}
                  className="whitespace-nowrap rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Opret profil
                </button>
              </>
            )}

            {userRole === 'jobseeker' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveView('jobseeker-dashboard')}
                  className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/20 hover:text-white"
                >
                  Min profil
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="whitespace-nowrap rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Log ud
                </button>
              </>
            )}

            {userRole === 'company' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveView('company-dashboard')}
                  className="hidden whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/20 hover:text-white md:block"
                >
                  Dashboard
                </button>
                <a
                  href="#create"
                  onClick={(event) => {
                    event.preventDefault()
                    showHomeView('Virksomheder', undefined, 'create')
                  }}
                  className="inline-flex whitespace-nowrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <PlusIcon />
                  {t.createListing}
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Log ud
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 lg:hidden"
          >
            <span className="sr-only">Åbn menu</span>
            <span className="grid gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="mx-4 rounded-3xl border border-white/15 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md lg:hidden">
            <nav className="grid gap-2 text-sm font-semibold text-white">
              {tabs.map((tab) => (
                <a
                  key={tab.key}
                  href={tab.href}
                  onClick={(event) => {
                    event.preventDefault()
                    showHomeView(tab.key, 'type' in tab ? tab.type : undefined, tab.href.replace('#', ''))
                  }}
                  className={`rounded-2xl px-4 py-3 ${activeTab === tab.key ? 'bg-white/15' : 'hover:bg-white/10'}`}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
              {userRole === 'guest' && (
                <>
                  <button type="button" onClick={() => openLoginModal()} className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10">
                    {t.login}
                  </button>
                  <button type="button" onClick={() => openSignupModal('select')} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    Opret profil
                  </button>
                </>
              )}
              {userRole === 'jobseeker' && (
                <>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); setActiveView('jobseeker-dashboard') }} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    Min profil
                  </button>
                  <button type="button" onClick={logout} className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10">
                    Log ud
                  </button>
                </>
              )}
              {userRole === 'company' && (
                <>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); setActiveView('company-dashboard') }} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    Dashboard
                  </button>
                  <button type="button" onClick={() => showHomeView('Virksomheder', undefined, 'create')} className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10">
                    Opret opslag
                  </button>
                  <button type="button" onClick={logout} className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10">
                    Log ud
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {activeView === 'company-dashboard' && (
          <CompanyDashboard
            companyJobs={allCompanyJobs}
            jobs={allJobs}
            applicantProfiles={applicantProfiles}
            applications={applications}
            onSendApplicationReply={sendApplicationReply}
            onBackHome={returnToFrontPage}
            onShowJobs={() => returnToFrontPage('jobs')}
            onCreateJob={() => returnToFrontPage('create')}
            onEditJob={editCompanyJob}
            onCloseJob={closeCompanyJob}
            companyProfile={companySignup}
            onSwitchRole={(role) => {
              setUserRole(role)
              setActiveView(role === 'jobseeker' ? 'jobseeker-dashboard' : 'company-dashboard')
            }}
          />
        )}

        {activeView === 'jobseeker-dashboard' && (
          <JobSeekerDashboard
            applications={jobSeekerApplications}
            savedJobs={savedProfileJobs}
            notifications={notifications}
            onBackHome={returnToFrontPage}
            onFindJobs={() => returnToFrontPage('jobs')}
            onViewSavedJob={(job) => openJobDetails(job)}
            onSwitchRole={(role) => {
              setUserRole(role)
              setActiveView(role === 'jobseeker' ? 'jobseeker-dashboard' : 'company-dashboard')
            }}
            profile={{
              name: applicationForm.applicantName,
              age: applicationForm.applicantAge,
              city: applicationForm.applicantCity,
              education: applicationForm.applicantEducation,
              email: applicationForm.applicantEmail,
              phone: applicationForm.applicantPhone,
              bio: jobSeekerSignup.bio || 'Motiveret ung fra Nakskov, der søger job med ansvar, gode kolleger og mulighed for at lære nyt.',
              cvFileName: applicationForm.cvFileName,
            }}
          />
        )}

        {activeView === 'home' && (
        <>
        <section className="relative min-h-[80vh] w-full overflow-hidden border-b border-slate-200 lg:min-h-screen">
          <div className="relative flex min-h-[80vh] w-full items-center overflow-hidden lg:min-h-screen">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/nakskov-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 z-10 bg-black/45" />
            <div className="relative z-20 w-full px-4 pb-12 pt-28 sm:px-8 lg:px-16">
              <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
                {t.pilot}
              </p>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {t.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
                {t.heroText}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#jobs"
                  className="w-full rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-100 sm:w-auto"
                >
                  {t.seeListings}
                </a>
                <button
                  type="button"
                  onClick={() => openSignupModal('company')}
                  className="w-full rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-center font-semibold text-white hover:bg-white/15 sm:w-auto"
                >
                  {t.createAsCompany}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="jobs" className="relative bg-[#f7f7f5]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-[#f7f7f5]" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-semibold text-[#B68A4C]">{t.overview}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{t.currentListings}</h2>
              </div>
              <p className="text-sm text-slate-500">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'opslag fundet' : t.listingsFound}
              </p>
            </div>

            <div className="mb-6 grid gap-3 rounded-2xl border border-[#C59D5F]/40 bg-white/95 p-4 shadow-sm md:grid-cols-[1fr_220px]">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                {t.search}
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#C59D5F]"
                  placeholder={t.searchPlaceholder}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                {t.type}
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value as 'Alle' | JobType)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#C59D5F]"
                >
                  <option value="Alle">{t.all}</option>
                  <option>Fritidsjob</option>
                  <option>Praktik</option>
                  <option>Læreplads</option>
                  <option>Sommerjob</option>
                </select>
              </label>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSelected={selectedJob?.id === job.id}
                      isSaved={savedJobIds.includes(job.id)}
                      onSelect={() => openJobDetails(job)}
                      onToggleSaved={() => toggleSavedJob(job.id)}
                      labels={{
                        readListing: t.readListing,
                        posted: t.posted,
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#C59D5F] bg-white p-8 text-center shadow-sm">
                    <h3 className="text-xl font-bold">{t.noMatchesTitle}</h3>
                    <p className="mt-2 text-slate-600">{t.noMatchesText}</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        <section id="companies" className="border-y border-slate-200 bg-[#f7f7f5]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-5 sm:py-16 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-semibold text-[#B68A4C]">{t.forCompanies}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{t.companySectionTitle}</h2>
              <p className="mt-4 leading-8 text-slate-600">
                {t.companySectionText}
              </p>

              <div className="mt-6 grid gap-3">
                <CheckLine text={t.checkContact} />
                <CheckLine text={t.checkDetails} />
                <CheckLine text={t.checkDatabase} />
              </div>

              <button
                type="button"
                onClick={() => openSignupModal('company')}
                className="mt-8 inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50"
              >
                {t.createCompany}
              </button>

            </div>

            <form id="create" onSubmit={submitListing} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-xl sm:p-8">
              <h3 className="text-2xl font-bold">{t.createListing}</h3>
              <p className="mt-2 text-sm text-slate-600">{t.formIntro}</p>

              {formStatus === 'error' && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formErrorMessage || t.formError}
                </p>
              )}

              {formStatus === 'success' && (
                <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  {t.formSuccess}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput label={t.company} value={form.company} onChange={(value) => updateForm('company', value)} />
                <FormInput label={t.contactPerson} value={form.contactName} onChange={(value) => updateForm('contactName', value)} />
                <FormInput label="E-mail" type="email" value={form.email} onChange={(value) => updateForm('email', value)} />
                <FormInput label={t.phone} value={form.phone} onChange={(value) => updateForm('phone', value)} />
                <FormInput label={t.title} value={form.title} onChange={(value) => updateForm('title', value)} />
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  {t.type}
                  <select
                    value={form.type}
                    onChange={(event) => updateForm('type', event.target.value as JobType)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option>Fritidsjob</option>
                    <option>Praktik</option>
                    <option>Læreplads</option>
                    <option>Sommerjob</option>
                  </select>
                </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                {t.city}
                <input
                  value={PILOT_CITY}
                  disabled
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <span className="text-xs font-medium text-slate-500">Pilotområdet er Nakskov i v1.</span>
              </label>
                <FormInput label={t.age} value={form.age} onChange={(value) => updateForm('age', value)} placeholder={t.agePlaceholder} />
                <FormInput label={t.hours} value={form.hours} onChange={(value) => updateForm('hours', value)} placeholder={t.hoursPlaceholder} />
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Virksomhedslogo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleListingImageUpload(event.target.files?.[0], 'companyLogo')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none file:mb-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:font-semibold file:text-white focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 sm:file:mb-0"
                  />
                  {form.companyLogoFileName && <span className="text-xs font-semibold text-emerald-700">✓ {form.companyLogoFileName}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Rekrutteringsbillede
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleListingImageUpload(event.target.files?.[0], 'jobImage')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none file:mb-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:font-semibold file:text-white focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 sm:file:mb-0"
                  />
                  {form.jobImageFileName && <span className="text-xs font-semibold text-emerald-700">✓ {form.jobImageFileName}</span>}
                </label>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Logo og rekrutteringsbillede gør opslaget mere genkendeligt for lokale unge.
              </p>

              <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
                {t.description}
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                  className="min-h-32 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
                  placeholder={t.descriptionPlaceholder}
                />
              </label>

              <button className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 sm:w-auto">
                {t.sendListing}
              </button>
            </form>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-slate-200 bg-[#f7f7f5]">
          <style>
            {`
              @keyframes nakskovFlowIn {
                from {
                  opacity: 0;
                  transform: translateY(14px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Sådan virker det</h2>
              <p className="mt-3 text-lg leading-8 text-slate-600">Enkelt for unge. Enkelt for virksomheder.</p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <FlowCard
                icon="search"
                title="Find en mulighed"
                text="Unge finder job, praktik eller læreplads i Nakskov."
                delay="0ms"
              />
              <FlowArrow />
              <FlowCard
                icon="profile"
                title="Ansøg med profil"
                text="Den unge sender ansøgning med digital profil og CV."
                delay="120ms"
              />
              <FlowArrow />
              <FlowCard
                icon="message"
                title="Virksomheden svarer"
                text="Virksomheden modtager ansøgningen og sender svar på platformen."
                delay="240ms"
              />
            </div>
          </div>
        </section>
        </>
        )}
      </main>

      <div
        aria-live="polite"
        className={`pointer-events-none fixed right-5 top-24 z-[120] transition-all duration-200 ${
          toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        {toastMessage && (
          <div className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20">
            {toastMessage}
          </div>
        )}
      </div>

      {isJobModalOpen && selectedJob && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-3 py-4 sm:px-4 sm:py-6"
          onClick={() => setIsJobModalOpen(false)}
          role="presentation"
        >
          <article
            className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-3xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
          >
            <header className="border-b border-slate-200 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                    {selectedJob.type}
                  </span>
                  <h2 id="job-modal-title" className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
                    {selectedJob.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Luk
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                <span>{selectedJob.location}</span>
                <span>{selectedJob.hours}</span>
                <span>{selectedJob.applicationDeadline}</span>
                <span>{selectedJob.posted}</span>
              </div>

              {getJobImage(selectedJob) && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={getJobImage(selectedJob)}
                    alt={`${selectedJob.title} hos ${selectedJob.company}`}
                    className="mx-auto max-h-[520px] w-full object-contain"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = defaultJobBanner(selectedJob)
                    }}
                  />
                </div>
              )}
            </header>

            <div className="grid gap-6 p-4 sm:p-6">
              <section>
                <h3 className="text-xl font-bold">{t.aboutJob}</h3>
                <div className="mt-3 space-y-4 leading-8 text-slate-600">
                  <p className="font-medium text-slate-700">{selectedJob.description}</p>
                  {selectedJob.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <div className="border-t border-slate-200" />

              <section>
                <BulletList title={t.tasks} items={selectedJob.tasks} />
              </section>

              <div className="border-t border-slate-200" />

              <section>
                <BulletList title={t.requirements} items={selectedJob.requirements} />
              </section>

              <div className="border-t border-slate-200" />

              <section>
                <h3 className="text-xl font-bold">{t.howToApply}</h3>
                <p className="mt-3 leading-8 text-slate-600">{selectedJob.application}</p>
              </section>

              <div className="border-t border-slate-200" />

              <section>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Ansøgning via platformen</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-950">Ansøg med digital profil</h3>
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span aria-hidden="true">🔒</span>
                        Dit CV deles kun med virksomheden, når du sender en ansøgning.
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        For at sende en ansøgning skal du have en profil. Din profil og dit CV deles kun med virksomheden, når du aktivt sender en ansøgning.
                      </p>
                    </div>
                  </div>

                  {userRole !== 'jobseeker' ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h4 className="text-2xl font-bold">Opret profil for at ansøge</h4>
                      <p className="mt-2 leading-7 text-slate-600">
                        Opret en profil eller log ind for at sende din ansøgning med digital profil og CV.
                      </p>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setIsJobModalOpen(false)
                            openSignupModal('jobseeker')
                          }}
                          className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                        >
                          Opret profil
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsJobModalOpen(false)
                            setSelectedLoginRole('jobseeker')
                            openLoginModal()
                          }}
                          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-50"
                        >
                          Log ind
                        </button>
                      </div>
                    </div>
                  ) : applicationStatus === 'success' ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
                        ✓
                      </div>
                      <h4 className="mt-4 text-2xl font-bold">Ansøgning sendt</h4>
                      <p className="mt-2 leading-7 text-slate-600">
                        Virksomheden har modtaget din ansøgning og dit digitale CV.
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Du kan følge status under Mine ansøgninger.
                      </p>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setIsJobModalOpen(false)
                            setUserRole('jobseeker')
                            setActiveView('jobseeker-dashboard')
                            window.setTimeout(() => {
                              document.getElementById('jobseeker-applications')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              })
                            }, 50)
                          }}
                          className="rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
                        >
                          Se mine ansøgninger
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsJobModalOpen(false)}
                          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-50"
                        >
                          Luk
                        </button>
                      </div>
                    </div>
                  ) : (
                  <form onSubmit={submitApplication} className="mt-5 grid gap-4">
                    {applicationStatus === 'error' && applicationError && (
                      <p className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700">
                        {applicationError}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        label="Fulde navn"
                        value={applicationForm.applicantName}
                        onChange={(value) => updateApplicationForm('applicantName', value)}
                      />
                      <FormInput
                        label="E-mail"
                        type="email"
                        value={applicationForm.applicantEmail}
                        onChange={(value) => updateApplicationForm('applicantEmail', value)}
                      />
                      <FormInput
                        label="Telefon"
                        value={applicationForm.applicantPhone}
                        onChange={(value) => updateApplicationForm('applicantPhone', value)}
                      />
                      <FormInput
                        label="Alder"
                        value={applicationForm.applicantAge}
                        onChange={(value) => updateApplicationForm('applicantAge', value)}
                      />
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        By
                        <input
                          value={PILOT_CITY}
                          disabled
                          className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 outline-none"
                        />
                      </label>
                      <FormInput
                        label="Skole / uddannelse"
                        value={applicationForm.applicantEducation}
                        onChange={(value) => updateApplicationForm('applicantEducation', value)}
                      />
                    </div>

                    <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-bold">CV-fil</h4>
                          {selectedCvFile ? (
                            <div className="mt-2">
                              <p className="font-semibold text-emerald-800">
                                ✓ {selectedCvFile.source === 'profile' ? 'CV fundet på din profil' : 'CV klar til ansøgning'}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">{selectedCvFile.fileName}</p>
                            </div>
                          ) : existingProfileCv ? (
                            <div className="mt-2">
                              <p className="font-semibold text-emerald-800">✓ CV fundet på din profil</p>
                              <p className="mt-1 text-sm text-slate-600">{existingProfileCv.fileName}</p>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Upload dit CV som PDF. Filen må maksimalt være 10 MB.
                            </p>
                          )}
                          {cvError && (
                            <p className="mt-2 text-sm font-semibold text-red-700">{cvError}</p>
                          )}
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                          {existingProfileCv && (
                            <button
                              type="button"
                              onClick={useProfileCv}
                              className="w-full rounded-xl border border-emerald-700 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 sm:w-auto"
                            >
                              Brug dette CV
                            </button>
                          )}
                          <input
                            key={cvInputKey}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            id="cv-upload"
                            onChange={(event) => handleCvUpload(event.target.files?.[0])}
                          />
                          <label
                            htmlFor="cv-upload"
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
                          >
                            {selectedCvFile ? 'Skift CV' : 'Upload CV'}
                          </label>
                          {selectedCvFile && (
                            <button
                              type="button"
                              onClick={removeCvFile}
                              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                            >
                              Fjern CV
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Besked til virksomheden
                      <textarea
                        value={applicationForm.message}
                        onChange={(event) => updateApplicationForm('message', event.target.value)}
                        placeholder="Skriv kort hvorfor du søger jobbet. Feltet er valgfrit."
                        className="min-h-28 rounded-lg border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-700"
                      />
                    </label>

                    <label className="flex gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-slate-700">
                      <input
                        type="checkbox"
                        checked={applicationForm.gdprConsent}
                        onChange={(event) => updateApplicationForm('gdprConsent', event.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                        required
                      />
                      <span>
                        Jeg accepterer, at mit CV og mine kontaktoplysninger deles med virksomheden for dette opslag.
                        <span className="mt-1 block text-slate-500">
                          Dit CV deles kun med virksomheden, når du aktivt sender en ansøgning.
                        </span>
                      </span>
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={!canSubmitApplication}
                        className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                      >
                        Send ansøgning
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsJobModalOpen(false)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-50 sm:w-auto"
                      >
                        Luk
                      </button>
                    </div>
                  </form>
                  )}

                </div>
              </section>
            </div>
          </article>
        </div>
      )}

      {showCompanyAccountModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-3 py-4 sm:px-4 sm:py-6"
          onClick={() => setShowCompanyAccountModal(false)}
          role="presentation"
        >
          <article
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-account-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Virksomhedsprofil</p>
                <h2 id="company-account-modal-title" className="mt-2 text-2xl font-bold">
                  Du skal have en virksomhedsprofil for at oprette opslag.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCompanyAccountModal(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Luk
              </button>
            </div>

            <p className="mt-4 leading-7 text-slate-600">
              Opret en virksomhedsprofil eller log ind som virksomhed. Så kan du oprette opslag, modtage ansøgninger
              og sende svar til unge direkte på platformen.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setShowCompanyAccountModal(false)
                  openSignupModal('company')
                }}
                className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                Opret virksomhedsprofil
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompanyAccountModal(false)
                  openLoginModal('company')
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-50"
              >
                Log ind
              </button>
              <button
                type="button"
                onClick={() => setShowCompanyAccountModal(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50"
              >
                Luk
              </button>
            </div>
          </article>
        </div>
      )}

      {showRoleModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-3 py-4 sm:px-4 sm:py-6"
          onClick={() => setShowRoleModal(false)}
          role="presentation"
        >
          <article
            className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="pr-6">
                <h2 id="role-modal-title" className="text-2xl font-bold sm:text-3xl">
                  {signupStep === 'select' ? 'Opret profil' : signupStep === 'jobseeker' ? 'Opret profil' : 'Opret virksomhedsprofil'}
                </h2>
                {signupStep === 'select' && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Vælg hvordan du vil bruge NAKSKOV.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                aria-label="Luk opret profil"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {authError && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {authError}
              </p>
            )}

            {signupStep === 'select' && (
              <>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSignupStep('jobseeker')}
                    className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                      J
                    </span>
                    <h3 className="mt-4 text-xl font-bold">Jeg søger job, praktik eller læreplads</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Opret profil, upload CV og ansøg direkte på lokale opslag.
                    </p>
                    <span className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-slate-800">
                      Jeg søger job
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupStep('company')}
                    className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                      V
                    </span>
                    <h3 className="mt-4 text-xl font-bold">Jeg repræsenterer en virksomhed</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Opret opslag, modtag ansøgninger og svar kandidater direkte på platformen.
                    </p>
                    <span className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-slate-800">
                      Jeg er virksomhed
                    </span>
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Har du allerede en konto?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleModal(false)
                      openLoginModal()
                    }}
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Log ind
                  </button>
                </p>
              </>
            )}

            {signupStep === 'jobseeker' && (
              <form onSubmit={submitJobSeekerSignup} className="mt-6 grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput label="Fornavn" value={jobSeekerSignup.firstName} onChange={(value) => updateJobSeekerSignup('firstName', value)} />
                  <FormInput label="Efternavn" value={jobSeekerSignup.lastName} onChange={(value) => updateJobSeekerSignup('lastName', value)} />
                  <FormInput label="E-mail" type="email" value={jobSeekerSignup.email} onChange={(value) => updateJobSeekerSignup('email', value)} />
                  <FormInput label="Password" type="password" value={jobSeekerSignup.password} onChange={(value) => updateJobSeekerSignup('password', value)} />
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    By
                    <input
                      value={PILOT_CITY}
                      disabled
                      className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 outline-none"
                    />
                  </label>
                  <FormInput label="Alder" value={jobSeekerSignup.age} onChange={(value) => updateJobSeekerSignup('age', value)} />
                  <FormInput label="Telefon" value={jobSeekerSignup.phone} onChange={(value) => updateJobSeekerSignup('phone', value)} />
                </div>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Kort beskrivelse
                  <textarea
                    value={jobSeekerSignup.bio}
                    onChange={(event) => updateJobSeekerSignup('bio', event.target.value)}
                    className="min-h-24 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700"
                    placeholder="Fortæl kort hvad du søger, og hvad du er god til."
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  CV
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(event) => handleSignupCvUpload(event.target.files?.[0])}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none file:mb-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:font-semibold file:text-white focus:border-emerald-700 sm:file:mb-0"
                  />
                  {jobSeekerSignup.cvFileName ? (
                    <span className="text-xs font-semibold text-emerald-700">✓ {jobSeekerSignup.cvFileName}</span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">Upload PDF. CV kan også tilføjes senere.</span>
                  )}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 sm:w-auto">
                    Opret profil
                  </button>
                  <button type="button" onClick={() => setSignupStep('select')} className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 hover:bg-slate-50 sm:w-auto">
                    Tilbage
                  </button>
                </div>
              </form>
            )}

            {signupStep === 'company' && (
              <form onSubmit={submitCompanySignup} className="mt-6 grid gap-6">
                <section className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Virksomhed</h3>
                    <p className="mt-1 text-sm text-slate-500">Grundoplysninger om virksomheden.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput label="Virksomhedsnavn" value={companySignup.companyName} onChange={(value) => updateCompanySignup('companyName', value)} placeholder="Fx Nakskov Nærbutik" />
                    <FormInput label="CVR" value={companySignup.cvr} onChange={(value) => updateCompanySignup('cvr', value)} placeholder="Valgfrit for nu" />
                    <FormInput label="Branche" value={companySignup.industry} onChange={(value) => updateCompanySignup('industry', value)} placeholder="Fx detailhandel, café eller håndværk" />
                    <FormInput label="Adresse" value={companySignup.address} onChange={(value) => updateCompanySignup('address', value)} placeholder="Fx Axeltorv 1, 4900 Nakskov" />
                    <div className="sm:col-span-2">
                      <FormInput label="Hjemmeside" value={companySignup.website} onChange={(value) => updateCompanySignup('website', value)} placeholder="Fx https://virksomhed.dk" />
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 border-t border-slate-200 pt-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Kontaktperson</h3>
                    <p className="mt-1 text-sm text-slate-500">Den person unge og platformen kan kontakte.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput label="Kontaktperson" value={companySignup.contactPerson} onChange={(value) => updateCompanySignup('contactPerson', value)} placeholder="Fx Mette Hansen" />
                    <FormInput label="Rolle/titel" value={companySignup.contactRole} onChange={(value) => updateCompanySignup('contactRole', value)} placeholder="Fx butikschef" />
                    <FormInput label="E-mail" type="email" value={companySignup.email} onChange={(value) => updateCompanySignup('email', value)} placeholder="kontakt@virksomhed.dk" />
                    <FormInput label="Telefon" value={companySignup.phone} onChange={(value) => updateCompanySignup('phone', value)} placeholder="Fx 54 12 34 56" />
                    <div className="sm:col-span-2">
                      <FormInput label="Adgangskode" type="password" value={companySignup.password} onChange={(value) => updateCompanySignup('password', value)} placeholder="Mindst 6 tegn" />
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 border-t border-slate-200 pt-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Profil</h3>
                    <p className="mt-1 text-sm text-slate-500">Gør profilen genkendelig for unge i Nakskov.</p>
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Kort beskrivelse
                    <textarea
                      value={companySignup.description}
                      onChange={(event) => updateCompanySignup('description', event.target.value)}
                      className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
                      placeholder="Fortæl kort hvem I er, og hvilke unge I gerne vil møde."
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Logo (valgfrit)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleCompanyLogoUpload(event.target.files?.[0])}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none file:mb-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:font-semibold file:text-white focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 sm:file:mb-0"
                    />
                    {companySignup.logoFileName ? (
                      <span className="text-xs font-semibold text-emerald-700">✓ {companySignup.logoFileName}</span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">Valgfrit. Logo kan også tilføjes senere.</span>
                    )}
                  </label>
                </section>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 sm:w-auto">
                    Opret virksomhedsprofil
                  </button>
                  <button type="button" onClick={() => setSignupStep('select')} className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 hover:bg-slate-50 sm:w-auto">
                    Tilbage
                  </button>
                </div>
              </form>
            )}
          </article>
        </div>
      )}

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-3 py-4 sm:px-4 sm:py-6"
          onClick={() => setShowLoginModal(false)}
          role="presentation"
        >
          <article
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="pr-6">
                <h2 id="login-modal-title" className="text-3xl font-bold">
                  Log ind
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Få adgang til din profil, ansøgninger eller virksomheds-dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                aria-label="Luk login"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {authError && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {authError}
              </p>
            )}

            <form onSubmit={submitLogin} className="mt-6 grid gap-4">
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => { setSelectedLoginRole('jobseeker'); setAuthError('') }}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    selectedLoginRole === 'jobseeker' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  Jobsøgende
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedLoginRole('company'); setAuthError('') }}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    selectedLoginRole === 'company' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  Virksomhed
                </button>
              </div>

              <FormInput label="E-mail" type="email" value={loginEmail} onChange={(value) => { setLoginEmail(value); setAuthError('') }} />

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Adgangskode
                <div className="flex rounded-lg border border-slate-300 bg-white focus-within:border-emerald-700">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(event) => { setLoginPassword(event.target.value); setAuthError('') }}
                    className="min-w-0 flex-1 rounded-l-lg px-4 py-3 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((current) => !current)}
                    className="whitespace-nowrap rounded-r-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {showLoginPassword ? 'Skjul' : 'Vis'}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoginLoading ? 'Logger ind...' : 'Log ind'}
              </button>

              <div className="flex flex-col gap-2 text-center text-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false)
                    openSignupModal(selectedLoginRole === 'jobseeker' ? 'jobseeker' : 'company')
                  }}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Opret profil
                </button>
                <a href="#login-help" className="font-semibold text-slate-500 hover:text-slate-900">
                  Glemt adgangskode?
                </a>
              </div>

              <p className="text-center text-xs leading-5 text-slate-500">
                Vi deler aldrig dine oplysninger uden dit samtykke.
              </p>
            </form>
          </article>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-[#f7f7f5]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-2xl font-extrabold tracking-wide text-slate-950">NAKSKOV</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              Lokale job, praktik og lærepladser for unge i Nakskov.
            </p>
          </div>

          <FooterColumn
            title="Platform"
            links={[
              { label: 'Job', href: '#jobs' },
              { label: 'Praktik', href: '#jobs' },
              { label: 'Lærepladser', href: '#jobs' },
              { label: 'Virksomheder', href: '/virksomheder' },
            ]}
          />
          <FooterColumn
            title="For unge"
            links={[
              { label: 'Sådan søger du', href: '/saadan-soeger-du' },
              { label: 'Opret profil', href: '#opret-profil' },
              { label: 'Hjælp til CV', href: '/hjaelp-til-cv' },
              { label: 'FAQ', href: '/faq' },
            ]}
          />
          <FooterColumn
            title="For virksomheder"
            links={[
              { label: 'Opret opslag', href: '#companies' },
              { label: 'Opret virksomhedsprofil', href: '#companies' },
              { label: 'Sådan fungerer det', href: '#how-it-works' },
              { label: 'Kontakt', href: '/kontakt' },
            ]}
          />
          <FooterColumn
            title="Om Nakskov"
            links={[
              { label: 'Om projektet', href: '/om' },
              { label: 'Samarbejdspartnere', href: '/om' },
              { label: 'Kontakt', href: '/kontakt' },
              { label: 'Nyheder', href: '/om' },
            ]}
          />
          <FooterColumn
            title="Juridisk"
            links={[
              { label: 'Privatlivspolitik', href: '/privatlivspolitik' },
              { label: 'Cookies', href: '/cookies' },
              { label: 'Brugervilkår', href: '/brugervilkaar' },
            ]}
          />
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm font-medium text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>© 2026 NAKSKOV</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span>Pilotområde: Nakskov</span>
              <span>Made for local opportunities</span>
              <span>DA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CompanyDashboard({
  companyJobs,
  jobs,
  applicantProfiles,
  applications,
  onSendApplicationReply,
  onBackHome,
  onShowJobs,
  onCreateJob,
  onEditJob,
  onCloseJob,
  companyProfile,
  onSwitchRole,
}: {
  companyJobs: CompanyJob[]
  jobs: Job[]
  applicantProfiles: ApplicantProfile[]
  applications: Application[]
  onSendApplicationReply: (applicationId: number, message: string) => void
  onBackHome: () => void
  onShowJobs: () => void
  onCreateJob: () => void
  onEditJob: (job: CompanyJob) => void
  onCloseJob: (jobId: number) => void
  companyProfile: CompanySignupState
  onSwitchRole: (role: UserRole) => void
}) {
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(applicantProfiles[0]?.id ?? null)
  const [savedCandidateIds, setSavedCandidateIds] = useState<number[]>([2])
  const [applicantStatusById, setApplicantStatusById] = useState<Record<number, ApplicationStatus>>({})
  const [applicantReplyById, setApplicantReplyById] = useState<Record<number, string>>({})
  const totalApplications = applicantProfiles.length + applications.length
  const newApplications = applicantProfiles.filter((applicant) => (applicantStatusById[applicant.id] ?? applicant.status) === 'Ansøgning sendt').length + applications.filter((application) => application.status === 'Ansøgning sendt').length
  const activeJobs = companyJobs.filter((job) => job.status === 'Aktiv').length
  const selectedApplicant = applicantProfiles.find((applicant) => applicant.id === selectedApplicantId) ?? applicantProfiles[0]
  const selectedApplicantStatus = selectedApplicant ? applicantStatusById[selectedApplicant.id] ?? selectedApplicant.status : 'Ansøgning sendt'

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <DashboardSubNav
          items={[
            { label: '← Tilbage til forsiden', onClick: onBackHome, primary: true },
            { label: 'Se jobopslag', onClick: onShowJobs },
            { label: 'Opret opslag', onClick: onCreateJob },
            { label: 'Ansøgninger', href: '#company-applications' },
            { label: 'Virksomhedsprofil', href: '#company-profile' },
            { label: 'Skift til jobsøgende', onClick: () => onSwitchRole('jobseeker') },
          ]}
        />
        <DashboardHeader
          eyebrow="Virksomheds-dashboard"
          title="Overblik over opslag og kandidater"
          text="Administrer jobopslag, følg ansøgninger og hold styr på virksomhedens rekruttering ét sted."
          onBackHome={onBackHome}
        />

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Sådan hænger platformen sammen</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-800 md:grid-cols-5">
            <span>1. Virksomhedskonto</span>
            <span>2. Opret jobopslag</span>
            <span>3. Modtag ansøgning</span>
            <span>4. Send svar</span>
            <span>5. Ung læser svar</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            CV og profildata vises kun for kandidater, der aktivt har sendt en ansøgning til denne virksomhed.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Aktive opslag" value={String(activeJobs)} />
          <StatCard label="Nye ansøgninger" value={String(newApplications)} tone="green" />
          <StatCard label="Samlede ansøgninger" value={String(totalApplications)} />
          <StatCard label="Profilvisninger" value="248" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <DashboardCard title="Opret jobopslag" subtitle="Opret et lokalt opslag i Nakskov på få minutter.">
            <div className="grid gap-4 sm:grid-cols-2">
              <DashboardField label="Virksomhedsprofil" value="Aktiv" />
              <DashboardField label="By" value={PILOT_CITY} />
            </div>
            <button type="button" onClick={onCreateJob} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              Opret nyt opslag
            </button>
          </DashboardCard>

          <CompanyProfileCard profile={companyProfile} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <DashboardCard title="Mine opslag" subtitle="Status på virksomhedens aktive og planlagte opslag.">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.7fr_1fr] gap-4 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">
                <span>Titel</span>
                <span>Type</span>
                <span>By</span>
                <span>Status</span>
                <span>Ansøgere</span>
                <span>Handlinger</span>
              </div>
              <div className="divide-y divide-slate-200">
                {companyJobs.map((job) => (
                  <article key={job.id} className="grid gap-3 bg-white px-4 py-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.7fr_1fr] lg:items-center">
                    <div>
                      <h3 className="font-bold">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{job.postedDate}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{job.type}</span>
                    <span className="text-sm font-medium text-slate-700">{job.location}</span>
                    <StatusPill label={job.status} />
                    <span className="text-sm font-semibold text-slate-900">{job.applicantsCount}</span>
                    <div className="flex flex-wrap gap-2">
                      <SmallActionButton onClick={() => document.getElementById('company-applications')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Se ansøgere</SmallActionButton>
                      <SmallActionButton onClick={() => onEditJob(job)}>Rediger</SmallActionButton>
                      {job.status !== 'Lukket' && <SmallActionButton tone="danger" onClick={() => onCloseJob(job.id)}>Luk opslag</SmallActionButton>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Gemte kandidater" subtitle="Kandidater virksomheden har gemt efter en modtaget ansøgning.">
            <div className="grid gap-3">
              {applicantProfiles.filter((applicant) => savedCandidateIds.includes(applicant.id)).map((candidate) => (
                <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-bold">{candidate.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{candidate.education} · {candidate.city}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">Gemt fra ansøgning til {candidate.appliedJob}</p>
                </article>
              ))}
            </div>
          </DashboardCard>
        </div>

        <DashboardCard id="company-applications" title="Ansøgninger modtaget" subtitle="Kun ansøgere, der aktivt har søgt et job hos virksomheden, vises her." className="mt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-4">
            {applications.map((application) => {
              const job = jobs.find((item) => item.id === application.job_id)

              return (
                <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                      {application.applicant_name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">{application.applicant_name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{application.applicant_age} år · {application.applicant_city}</p>
                      <StatusPill label={application.status} className="mt-3" />
                    </div>
                  </div>
                  <dl className="mt-5 grid gap-2 text-sm">
                    <DashboardField label="Skole / uddannelse" value={application.applicant_education || 'Ikke angivet'} />
                    <DashboardField label="E-mail" value={application.applicant_email} />
                    <DashboardField label="Telefon" value={application.applicant_phone} />
                    <DashboardField label="Søgt job" value={job?.title ?? 'Ukendt opslag'} />
                    <DashboardField label="Dato" value={formatApplicationDate(application.created_at)} />
                  </dl>
                  <div className="mt-5 grid gap-3">
                    <CompanyReplyButtons
                      onSend={(message) => onSendApplicationReply(application.id, message)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <SmallActionLink href={application.cv_file_url}>Download / åbn CV</SmallActionLink>
                      <SmallActionLink href={`mailto:${application.applicant_email}`}>Kontakt</SmallActionLink>
                    </div>
                    {application.company_reply_message && (
                      <p className="rounded-xl bg-white p-3 text-sm leading-6 text-slate-700">
                        Svar sendt: {application.company_reply_message}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
            {applicantProfiles.map((applicant) => (
              <article key={applicant.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                    {applicant.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{applicant.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{applicant.age} år · {applicant.city}</p>
                    <StatusPill label={applicantStatusById[applicant.id] ?? applicant.status} className="mt-3" />
                  </div>
                </div>
                <dl className="mt-5 grid gap-2 text-sm">
                  <DashboardField label="Skole / uddannelse" value={applicant.education} />
                  <DashboardField label="E-mail" value={applicant.email} />
                  <DashboardField label="Telefon" value={applicant.phone} />
                  <DashboardField label="Søgt job" value={applicant.appliedJob} />
                  <DashboardField label="Dato" value={applicant.applicationDate} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <SmallActionLink href={applicant.cvUrl}>Se CV</SmallActionLink>
                  <SmallActionLink href={`mailto:${applicant.email}`}>Kontakt</SmallActionLink>
                  <SmallActionButton onClick={() => setSelectedApplicantId(applicant.id)}>Se detaljer</SmallActionButton>
                  <SmallActionButton
                    onClick={() => {
                      setApplicantStatusById((current) => ({ ...current, [applicant.id]: 'Svar modtaget' }))
                      setApplicantReplyById((current) => ({ ...current, [applicant.id]: 'Virksomheden vil gerne tale med dig' }))
                    }}
                  >
                    Send svar
                  </SmallActionButton>
                  <SmallActionButton onClick={() => setSavedCandidateIds((current) => current.includes(applicant.id) ? current : [...current, applicant.id])}>
                    Gem kandidat
                  </SmallActionButton>
                </div>
              </article>
            ))}
            </div>

            {selectedApplicant && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Ansøgerdetaljer</p>
                <h3 className="mt-2 text-2xl font-bold">{selectedApplicant.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Ansøgning knyttet til job og virksomhed. CV må kun åbnes, fordi kandidaten har ansøgt.
                </p>
                <dl className="mt-5 grid gap-3 text-sm">
                  <DashboardField label="Alder" value={`${selectedApplicant.age} år`} />
                  <DashboardField label="By" value={selectedApplicant.city} />
                  <DashboardField label="Uddannelse" value={selectedApplicant.education} />
                  <DashboardField label="Søgt job" value={selectedApplicant.appliedJob} />
                  <DashboardField label="Dato" value={selectedApplicant.applicationDate} />
                </dl>
                <div className="mt-5 grid gap-3">
                  <StatusPill label={selectedApplicantStatus} />
                  <CompanyReplyButtons
                    onSend={(message) => {
                      setApplicantStatusById((current) => ({ ...current, [selectedApplicant.id]: 'Svar modtaget' }))
                      setApplicantReplyById((current) => ({ ...current, [selectedApplicant.id]: message }))
                    }}
                  />
                  {applicantReplyById[selectedApplicant.id] && (
                    <p className="rounded-xl bg-white p-3 text-sm leading-6 text-slate-700">
                      Svar sendt: {applicantReplyById[selectedApplicant.id]}
                    </p>
                  )}
                  <SmallActionLink href={selectedApplicant.cvUrl}>Download / åbn CV</SmallActionLink>
                  <SmallActionLink href={`mailto:${selectedApplicant.email}`}>Kontakt kandidat</SmallActionLink>
                </div>
              </article>
            )}
          </div>
        </DashboardCard>
      </div>
    </section>
  )
}

function JobSeekerDashboard({
  applications,
  savedJobs,
  notifications,
  profile,
  onBackHome,
  onFindJobs,
  onViewSavedJob,
  onSwitchRole,
}: {
  applications: Array<{ id: number; title: string; company: string; location: string; sentDate: string; status: JobSeekerApplicationStatus; replyMessage?: string }>
  savedJobs: Job[]
  notifications: NotificationItem[]
  profile: { name: string; age: string; city: string; education: string; email: string; phone: string; bio: string; cvFileName: string }
  onBackHome: () => void
  onFindJobs: () => void
  onViewSavedJob: (job: Job) => void
  onSwitchRole: (role: UserRole) => void
}) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <DashboardSubNav
          items={[
            { label: '← Tilbage til forsiden', onClick: onBackHome, primary: true },
            { label: 'Find job', onClick: onFindJobs },
            { label: 'Mine ansøgninger', href: '#jobseeker-applications' },
            { label: 'Mit CV', href: '#digital-cv' },
            { label: 'Min profil', href: '#profile-overview' },
            { label: 'Skift til virksomhed', onClick: () => onSwitchRole('company') },
          ]}
        />
        <DashboardHeader
          eyebrow="Min profil"
          title="Dit joboverblik"
          text="Hold styr på digitalt CV, ansøgninger, gemte opslag og beskeder fra virksomheder."
          onBackHome={onBackHome}
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <div className="grid gap-6">
            <DashboardCard id="profile-overview" title="Profiloverblik">
              <div className="flex gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-bold text-white">
                  {profile.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{profile.name}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{profile.age} år · {profile.city}</p>
                  <p className="mt-3 leading-7 text-slate-600">{profile.bio}</p>
                </div>
              </div>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <DashboardField label="Skole / uddannelse" value={profile.education} />
                <DashboardField label="E-mail" value={profile.email} />
                <DashboardField label="Telefon" value={profile.phone} />
                <DashboardField label="By" value={profile.city} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Profilstyrke" subtitle="Gør din profil mere attraktiv for virksomheder.">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
                  72%
                </div>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[72%] rounded-full bg-emerald-600" />
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                    <li>Profilbillede mangler</li>
                    <li>CV kan opdateres</li>
                    <li>Kort bio kan gøres skarpere</li>
                    <li>Kompetencer mangler</li>
                  </ul>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard id="digital-cv" title="Digitalt CV" subtitle="Dit CV deles kun, når du aktivt sender en ansøgning.">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-emerald-800">✓ {profile.cvFileName || 'Intet CV uploadet'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SmallActionButton>Upload nyt CV</SmallActionButton>
                  <SmallActionButton tone="danger">Slet CV</SmallActionButton>
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid gap-6">
            <DashboardCard id="jobseeker-applications" title="Mine ansøgninger">
              <div className="grid gap-3">
                {applications.map((application) => (
                  <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold">{application.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{application.company} · {application.location}</p>
                        <p className="mt-2 text-xs font-medium text-slate-500">Ansøgning sendt {application.sentDate}</p>
                      </div>
                      <StatusPill label={application.status} />
                    </div>
                    <ApplicationTimeline status={application.status} />
                    {application.status === 'Svar modtaget' && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-bold text-emerald-900">Svar fra virksomheden</p>
                        <p className="mt-2 text-sm leading-6 text-emerald-950/80">
                          {application.replyMessage ?? 'Virksomheden har sendt et svar. Åbn beskeden for at læse den.'}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Gemte opslag">
              {savedJobs.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {savedJobs.map((job) => (
                    <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-emerald-700">{job.type}</p>
                      <h3 className="mt-2 font-bold">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{job.company} · {job.location}</p>
                      <button
                        type="button"
                        onClick={() => onViewSavedJob(job)}
                        className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Se opslag
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                  <p className="font-semibold text-slate-900">Du har ingen gemte opslag endnu.</p>
                </div>
              )}
            </DashboardCard>

            <DashboardCard title="Notifikationer">
              <div className="grid gap-3">
                {notifications.map((notification) => (
                  <article key={notification.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">{notification.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{notification.text}</p>
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-slate-500">{notification.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardSubNav({
  items,
}: {
  items: Array<{ label: string; href?: string; onClick?: () => void; primary?: boolean }>
}) {
  return (
    <nav className="mb-6 flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:flex-wrap">
      {items.map((item) => {
        const className = `rounded-2xl px-4 py-2.5 text-left text-sm font-semibold transition sm:whitespace-nowrap ${
          item.primary
            ? 'bg-slate-950 text-white hover:bg-slate-800'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
        }`

        if (item.onClick) {
          return (
            <button key={item.label} type="button" onClick={item.onClick} className={className}>
              {item.label}
            </button>
          )
        }

        return (
          <a
            key={item.label}
            href={item.href}
            onClick={(event) => {
              if (!item.href?.startsWith('#')) {
                return
              }

              event.preventDefault()
              window.history.replaceState(null, '', item.href)
              document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className={className}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

function DashboardHeader({
  eyebrow,
  title,
  text,
  onBackHome,
}: {
  eyebrow: string
  title: string
  text: string
  onBackHome: () => void
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <button
          type="button"
          onClick={onBackHome}
          className="mb-4 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Tilbage til forsiden
        </button>
        <p className="font-semibold text-emerald-700">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">{text}</p>
      </div>

      <div className="mt-5">
        <CompanyReplyButtons onSend={(message) => onSendReply(application.id, message)} />
        {application.company_reply_message && (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
            Svar sendt: {application.company_reply_message}
          </p>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
        CV deles kun med virksomheden, fordi kandidaten har sendt en ansøgning.
      </div>
    </div>
  )
}

function DashboardCard({
  id,
  title,
  subtitle,
  children,
  className = '',
}: {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function StatCard({ label, value, tone = 'slate' }: { label: string; value: string; tone?: 'slate' | 'green' }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone === 'green' ? 'text-emerald-700' : 'text-slate-950'}`}>{value}</p>
    </article>
  )
}

function CompanyProfileCard({ profile }: { profile: CompanySignupState }) {
  const companyName = profile.companyName || 'MENY Nakskov'
  const description = profile.description || 'Lokal virksomhed i Nakskov med fokus på kvalitet, ordentlighed og gode muligheder for unge.'
  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join('')
    .toUpperCase()
    || 'N'

  return (
    <DashboardCard id="company-profile" title="Virksomhedsprofil" subtitle="De oplysninger kandidater og ansøgere møder på platformen.">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-700">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt={`${companyName} logo`} className="h-full w-full object-contain p-1" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold">{companyName}</h3>
          <p className="mt-2 leading-7 text-slate-600">
            {description}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid gap-3 text-sm">
        <DashboardField label="CVR" value={profile.cvr || 'Ikke udfyldt'} />
        <DashboardField label="Kontaktperson" value={profile.contactPerson || 'Ikke udfyldt'} />
        <DashboardField label="Adresse" value={profile.address || 'Nakskov'} />
        <DashboardField label="E-mail" value={profile.email || 'Ikke udfyldt'} />
        <DashboardField label="Telefon" value={profile.phone || 'Ikke udfyldt'} />
        <DashboardField label="Logo" value={profile.logoFileName || 'Ikke uploadet'} />
      </dl>
      <button className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        Rediger virksomhedsprofil
      </button>
    </DashboardCard>
  )
}

function DashboardField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-900">{value}</dd>
    </div>
  )
}

function ApplicationTimeline({ status }: { status: ApplicationStatus }) {
  const steps: ApplicationStatus[] = ['Ansøgning sendt', 'Svar modtaget']
  const currentIndex = steps.indexOf(status)

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Status</p>
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const isActive = step === status
          const isCompleted = currentIndex >= 0 && index < currentIndex

          return (
            <span
              key={step}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isActive
                  ? 'bg-emerald-700 text-white'
                  : isCompleted
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CompanyReplyButtons({ onSend }: { onSend: (message: string) => void }) {
  const messages = [
    'Vi vil gerne tale med dig',
    'Tak for ansøgningen',
    'Vi har valgt en anden kandidat',
    'Kontakt os gerne',
    'Stillingen er besat',
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Send svar til ansøger</p>
      <div className="flex flex-wrap gap-2">
        {messages.map((message) => (
          <SmallActionButton key={message} onClick={() => onSend(message)}>
            {message}
          </SmallActionButton>
        ))}
      </div>
    </div>
  )
}

function StatusPill({ label, className = '' }: { label: string; className?: string }) {
  const tone = label === 'Lukket' ? 'bg-red-50 text-red-700' : label === 'Aktiv' || label === 'Ansøgning sendt' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-700'
  return <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${tone} ${className}`}>{label}</span>
}

function SmallActionButton({
  children,
  tone = 'neutral',
  onClick,
}: {
  children: string
  tone?: 'neutral' | 'danger'
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
        tone === 'danger'
          ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

function SmallActionLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('/') ? '_blank' : undefined}
      rel={href.startsWith('/') ? 'noreferrer' : undefined}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </a>
  )
}

function formatApplicationDate(value: string) {
  return new Intl.DateTimeFormat('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function FlowCard({
  icon,
  title,
  text,
  delay,
}: {
  icon: 'search' | 'profile' | 'message'
  title: string
  text: string
  delay: string
}) {
  return (
    <article
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      style={{ animation: `nakskovFlowIn 520ms ease-out ${delay} both` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <FlowIcon type={icon} />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </article>
  )
}

function FlowArrow() {
  return (
    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 md:flex">
      →
    </div>
  )
}

function FlowIcon({ type }: { type: 'search' | 'profile' | 'message' }) {
  if (type === 'search') {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
    )
  }

  if (type === 'profile') {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <circle cx="11" cy="13" r="2" />
        <path d="M8 18c.6-1.4 1.6-2 3-2s2.4.6 3 2" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6a8 8 0 1 1 18-5z" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; href: string }>
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-[#8a6434]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function defaultCompanyLogo(company: string) {
  const initial = company.slice(0, 1)
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#0f172a"/><text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="white">${initial}</text></svg>`,
  )}`
}

function defaultJobBanner(job: Job) {
  const company = job.company
  const title = job.title
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#0f172a"/><stop offset="1" stop-color="#065f46"/></linearGradient></defs><rect width="1200" height="520" fill="url(#g)"/><text x="80" y="210" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#a7f3d0">${company}</text><text x="80" y="300" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="white">${title}</text></svg>`,
  )}`
}

function getJobCompany(job: Job) {
  return (
    companies.find((company) => company.id === job.companyId) ?? {
      id: job.companyId,
      name: job.company,
      description: job.companyProfile,
      contactEmail: job.contactEmail,
      contactPhone: job.contactPhone,
    }
  )
}

function getCompanyLogo(job: Job) {
  return getJobCompany(job).logoUrl ?? job.companyLogo
}

function getJobImage(job: Job) {
  return job.jobImage ?? getJobCompany(job).coverImageUrl
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function JobCard({
  job,
  isSelected,
  isSaved,
  onSelect,
  onToggleSaved,
  labels,
}: {
  job: Job
  isSelected: boolean
  isSaved: boolean
  onSelect: () => void
  onToggleSaved: () => void
  labels: {
    readListing: string
    posted: string
  }
}) {
  const logoUrl = getCompanyLogo(job)

  function handleBookmarkClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    onToggleSaved()
  }

  return (
    <article
      className={`flex min-h-[300px] flex-col rounded-3xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${
        isSelected ? 'border-[#C59D5F] ring-2 ring-[#C59D5F]/20' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#B68A4C]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B68A4C] shadow-sm shadow-[#B68A4C]/30" />
          <span>{job.status}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-right text-xs text-slate-500 sm:gap-3 sm:text-sm">
          <span>Opslået {job.postedAgo}</span>
          <button
            type="button"
            aria-label={isSaved ? 'Fjern gemt opslag' : 'Gem opslag'}
            title={isSaved ? 'Fjern gemt opslag' : 'Gem opslag'}
            onClick={handleBookmarkClick}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isSaved
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookmarkIcon filled={isSaved} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mt-5 flex items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${job.company} logo`}
                loading="lazy"
                className="h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.src = defaultCompanyLogo(job.company)
                }}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950 text-base font-bold text-white">
              {job.company.slice(0, 1)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-950 sm:text-2xl">{job.title}</h3>
            <p className="mt-1 truncate font-semibold text-slate-700">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-500">
          <span>{job.location}</span>
          <span className="text-slate-300">·</span>
          <span>{job.type}</span>
          <span className="text-slate-300">·</span>
          <span>{job.age}</span>
          <span className="text-slate-300">·</span>
          <span>{job.verified ? 'Verificeret' : 'Ikke verificeret'}</span>
        </div>

        <p className="mt-4 line-clamp-2 text-base leading-7 text-slate-600">{job.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-stretch gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-slate-500">{job.applicantsCount} ansøgere</span>
          <button
            type="button"
            onClick={onSelect}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-950/20 hover:bg-blue-500 sm:w-auto"
          >
            {labels.readListing}
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-800">{value}</dd>
    </div>
  )
}

function ContactDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-emerald-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-medium text-emerald-900/70">{label}</dt>
      <dd className="font-semibold text-slate-950">{value}</dd>
    </div>
  )
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-bold">{title}</h4>
      <ul className="mt-2 grid gap-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CheckLine({ text }: { text: string }) {
  return (
    <p className="flex gap-3 text-sm font-medium text-slate-700">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B68A4C]/15 text-xs text-[#B68A4C]">✓</span>
      {text}
    </p>
  )
}

function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  )
}

export default App





"use client";
import React, { useEffect } from "react";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { useState } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnsSection from "./_components/RecordAnsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewData, setInteviewData] = useState(null);
  const [interviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);

  useEffect(() => {
    getInterviewDetails();
  },[]);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    // const stringRes = JSON.stringify(result[0].jsonMockResponse);
    const jsonMockResponse = JSON.parse(result[0].jsonMockResponse);

    // console.log(jsonMockResponse);

    setInteviewData(result[0]);
    setMockInterviewQuestion(jsonMockResponse["interviewQuestions"]);
    console.log(interviewQuestion);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/*  Questions */}
        <QuestionSection
          mockInterviewQuestion={interviewQuestion}
          activeQuestion={activeQuestion}
        />
        <RecordAnsSection
          mockInterviewQuestion={interviewQuestion}
          activeQuestion={activeQuestion}
          interviewData={interviewData}
        />
        {/*  video audio record */}
      </div>
      <div className="flex justify-end gap-8">
        {activeQuestion > 0 && <Button onClick={ ()=>setActiveQuestion(activeQuestion-1)}>Previous Question</Button>}
        {activeQuestion != interviewQuestion.length - 1 && (
          <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestion == interviewQuestion.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
            <Button>End Interview</Button>
            </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
